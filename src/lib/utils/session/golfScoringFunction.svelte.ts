import type { Player, RankedPlayer } from '$lib/types/playerType';
import type { Team, RankedTeam } from '$lib/types/teamType';
import type { Target } from '$lib/types/targetType';
import type { Regulation } from '$lib/types/regulationsType';
import { toPng } from 'html-to-image';

//                      //
// --    Parcours    -- //
//                      //

// Retourne le Par total du parcours
export const getTotalPar = (targets: Target[]) => {
	return targets.reduce((sum, t) => sum + t.par, 0);
};

//                      //
// --    Joueurs     -- //
//                      //

// Retourne le score total d'un joueur sur un parcours
export const calculatePlayerScore = (player: Player, targets: Target[]) => {
	//console.log(player);

	const result = targets.reduce((sum, target) => {
		return sum + (player.scores[target.id] || 0);
	}, 0);
	//console.log('player', player, 'targets', targets, 'result', result);
	return result;
};

// Retourne la liste des joueurs classés par score avec mise à jour
export const getRankedPlayers = (players: Player[], targets: Target[]): RankedPlayer[] => {
	// 1. On calcule les scores totaux et on trie
	const sorted = [...players]
		.map((p) => ({
			player: p,
			totalScore: calculatePlayerScore(p, targets)
		}))
		.sort((a, b) => a.totalScore - b.totalScore);

	// 2. On attribue les rangs avec gestion des ex-aequo
	return sorted.map((entry, index, array) => {
		let rank = index + 1;
		let isTie = false;

		if (index > 0 && entry.totalScore === array[index - 1].totalScore) {
			// Si même score que le précédent, on cherche le rang du premier de la série
			let i = index;
			while (i > 0 && array[i].totalScore === array[i - 1].totalScore) {
				i--;
			}
			rank = i + 1;
			isTie = true;
		} else if (index < array.length - 1 && entry.totalScore === array[index + 1].totalScore) {
			isTie = true;
		}

		return {
			...entry,
			rank,
			isTie
		};
	});
};

// Retourne pour le score d'un joueur
// son score brut et son écart par rapport au Par du parcours
export const getPlayerStats = (player: Player, targets: Target[]) => {
	const gross = calculatePlayerScore(player, targets);
	const diff = gross - getTotalPar(targets);
	const diffText = diff > 0 ? `(+${diff})` : diff < 0 ? `(${diff})` : '(E)';

	return { gross, diffText, diff };
};

// Retourne la liste des joueurs pour le podium
export const getTop3Players = (rankedPlayers: RankedPlayer[]) => {
	return rankedPlayers.slice(0, 3);
};
export const getOthersRankedPlayers = (rankedPlayers: RankedPlayer[]) => {
	return rankedPlayers.slice(3);
};

export const exportPSCToCSV = (rankedPlayers: RankedPlayer[], targets: Target[]) => {
	// 1. Définition des entêtes
	const header1 = [
		'Cibles',
		...targets.map((t, i) => t.name || 'Cible #' + (i + 1)).flat(),
		'Total'
	];
	const header2 = ['Par', ...targets.map((t) => t.par).flat(), getTotalPar(targets)];
	const header3 = ['Rdj', ...targets.map((t) => t.rule).flat(), '...'];

	// 2. Construction des lignes
	const rows = rankedPlayers.map((rp) => {
		return [
			rp.player.name,
			...targets.map((t) => rp.player.scores[t.id]),
			calculatePlayerScore(rp.player, targets)
		].join(';');
	});

	const csvContent = [header1.join(';'), header2.join(';'), header3.join(';'), ...rows].join('\n');

	// 3. Téléchargement forcé
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.setAttribute('download', `scores_competition.csv`);
	link.click();
};

//                      //
// --    Équipes    --  //
//                      //

// Retourne le score total d'une équipe pour un parcours
export const calculateTeamScore = (
	team: Team,
	targets: Target[],
	players: Player[],
	settings: Regulation
) => {
	// Pour toutes les cibles du parcours
	return parseFloat(
		(
			targets.reduce((sum, target) => {
				// 1. Récupération des scores réels présents
				const scores = team.playersId.map((id) => {
					const p = players.find((p) => p.id === id);
					return p?.scores[target.id] || 0;
				});

				// 2. Injection des fantômes si l'équipe est incomplète
				while (scores.length < settings.playersPerTeam) {
					let ghostValue: number;
					switch (target.rule) {
						case 'Bonus':
							ghostValue = 0;
							break;
						case 'Team_Bonus':
							ghostValue = 0;
							break;
						case 'Individuel':
							if (settings.usePenalizingGhost) {
								if (settings.hasCrossAFixedPenalty) ghostValue = settings.malusValue;
								else ghostValue = target.par + settings.malusOverPar;
							} else ghostValue = scores[0];
							break;
						default:
							ghostValue = scores[0];
							break;
					}
					scores.push(ghostValue);
				}

				// 3. Somme des scores de la cible pour l'équipe
				const targetTotal = scores.reduce((a, b) => a + b, 0);

				return sum + targetTotal;
			}, 0) / settings.playersPerTeam
		).toFixed(2)
	);
};

// Retourne la liste des id des joueurs de l'équipe
export const listTeamPlayer = (team: Team, players: Player[]) => {
	// On mappe les IDs de l'équipe vers les objets joueurs du store
	return team.playersId
		.map((id) => {
			return players.find((p) => p.id === id);
		})
		.filter((p) => p !== undefined); // Sécurité pour éviter les éléments vides
};

// Retourne la liste formattée des noms des joueurs de l'équipe
export const formatPlayerList = (players: Player[], settings: Regulation) => {
	let names = players.map((p) => p.name);
	if (names.length < settings.playersPerTeam) names.push('👻');

	// On crée le formateur pour le français
	const formatter = new Intl.ListFormat('fr', {
		style: 'long',
		type: 'conjunction'
	});

	return formatter.format(names);
};

// Retourne pour le score d'une équipe
// son score brut et son écart par rapport au Par du parcours
export const getTeamStats = (
	team: Team,
	targets: Target[],
	players: Player[],
	settings: Regulation
) => {
	const gross = calculateTeamScore(team, targets, players, settings);
	const diff = gross - getTotalPar(targets) * settings.playersPerTeam;
	const diffText = diff > 0 ? `(+${diff})` : diff < 0 ? `(${diff})` : '(E)';

	return { gross, diffText, diff };
};

export const getRankedTeams = (
	teams: Team[],
	targets: Target[],
	players: Player[],
	settings: Regulation
): RankedTeam[] => {
	// 1. On calcule les scores totaux et on trie
	const sorted = [...teams]
		.map((team) => ({
			team: team,
			totalScore: calculateTeamScore(team, targets, players, settings)
		}))
		.sort((a, b) => a.totalScore - b.totalScore);

	// 2. On attribue les rangs avec gestion des ex-aequo
	return sorted.map((entry, index, array) => {
		let rank = index + 1;
		let isTie = false;

		if (index > 0 && entry.totalScore === array[index - 1].totalScore) {
			// Si même score que le précédent, on cherche le rang du premier de la série
			let i = index;
			while (i > 0 && array[i].totalScore === array[i - 1].totalScore) {
				i--;
			}
			rank = i + 1;
			isTie = true;
		} else if (index < array.length - 1 && entry.totalScore === array[index + 1].totalScore) {
			isTie = true;
		}

		return {
			...entry,
			rank,
			isTie
		};
	});
};

// Liste des équipes pour le podium
export const getTop3Teams = (rankedTeams: RankedTeam[]) => rankedTeams.slice(0, 3);
export const getOthersRankedTeams = (rankedTeams: RankedTeam[]) => rankedTeams.slice(3);

export const exportTSCToCSV = (
	rankedTeams: RankedTeam[],
	targets: Target[],
	players: Player[],
	settings: Regulation
) => {
	// 1. Définition des entêtes
	const header1 = [
		'',
		'Cibles',
		...targets.map((t, i) => t.name || 'Cible #' + (i + 1)).flat(),
		'Total'
	];
	const header2 = ['', 'Par', ...targets.map((t) => t.par).flat(), getTotalPar(targets)];
	const header3 = ['', 'Rdj', ...targets.map((t) => t.rule).flat(), '...'];

	// 2. Construction des lignes
	let rows: string[] = [];
	rankedTeams.forEach((rt) => {
		listTeamPlayer(rt.team, players).forEach((p) => {
			const row = [
				rt.team.name,
				p.name,
				...targets.map((t) => p.scores[t.id]),
				calculatePlayerScore(p, targets)
			].join(';');
			rows.push(row);
		});
	});

	const csvContent = [header1.join(';'), header2.join(';'), header3.join(';'), ...rows].join('\n');

	// 3. Téléchargement forcé
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.setAttribute('download', `scores_competition.csv`);
	link.click();
};

//                       //
// --    Résultats    -- //
//                       //

// Retourne la classe CSS associée au score pour le style
export const getScoreClass = (score: number, target: Target) => {
	if (score === 0) return ''; // Pas encore joué
	if (target.rule === 'Bonus' || target.rule === 'Team_Bonus') return 'score-bonus';

	const diff = score - target.par;

	if (diff < -1) return 'score-eagle';
	if (diff === -1) return 'score-birdie';
	if (diff === 0) return 'score-par';
	if (diff === 1) return 'score-bogey';
	return 'score-double-bogey';
};

// Partage des résultats des joueurs via l'API native de partage
export const shareResultsPlayers =
	(rankedPlayers: RankedPlayer[], targets: Target[], photo?: any) => async () => {
		// 1. On prépare le texte du message
		let message = `🏆 Résultats avec PopScores\n\n`;
		let shared: boolean = false;

		rankedPlayers.forEach((rankedPlayer, index) => {
			const stats = getPlayerStats(rankedPlayer.player, targets);
			const medal = index === 0 ? '🥇 ' : index === 1 ? '🥈 ' : index === 2 ? '🥉 ' : '🔹 ';
			message += `${medal}${rankedPlayer.player.name}: ${stats.gross} ${stats.diffText}\n`;
		});

		message += `\nLa session du jour ⛳`;

		// Envoi avec photo si elle existe
		if (photo) {
			if (navigator.canShare && navigator.canShare({ files: [photo] })) {
				try {
					await navigator.share({
						files: [photo],
						title: 'Résultat de la partie',
						text: message
					});
					shared = true;
				} catch (err) {
					console.log("Echec de l'envoi avec photo : ", err);
				}
			} else console.log('pas de partage avec photo');
		}

		// Envoi si pas de photo ou échec envoi avec photo
		if (navigator.share && !shared) {
			try {
				await navigator.share({
					title: 'Résultat de la partie',
					text: message
				});
			} catch (err) {
				console.log('Partage annulé ou erreur:', err);
			}
		} else {
			// Option de secours si le navigateur est trop vieux
			alert("Le partage n'est pas supporté sur ce navigateur. Voici les résultats :\n\n" + message);
		}
	};

// Partage des résultats d'équipes via l'API native de partage
export const shareResultsTeams =
	(
		rankedTeams: RankedTeam[],
		targets: Target[],
		players: Player[],
		settings: Regulation,
		photo?: any
	) =>
	async () => {
		console.log('photo', photo);

		// 1. On prépare le texte du message
		let message = `🏆 Résultats PopScores \n\n`;
		let shared: boolean = false;

		rankedTeams.forEach((team, index) => {
			const stats = getTeamStats(team.team, targets, players, settings);
			const medal = index === 0 ? '🥇 ' : index === 1 ? '🥈 ' : index === 2 ? '🥉 ' : '🔹 ';
			message += `${medal}${team.team.name}: ${stats.gross} ${stats.diffText}\n`;
		});

		message += `\nJoué avec PopScores ⛳`;

		// Envoi avec photo si elle existe
		if (photo) {
			if (navigator.canShare && navigator.canShare({ files: [photo] })) {
				try {
					await navigator.share({
						files: [photo],
						title: 'Résultat de la partie',
						text: message
					});
					shared = true;
				} catch (err) {
					console.log("Echec de l'envoi avec photo : ", err);
				}
			}
		}

		// Envoi si pas de photo ou échec envoi avec photo
		if (navigator.share && !shared) {
			try {
				await navigator.share({
					title: 'Résultat de la partie',
					text: message
				});
			} catch (err) {
				console.log('Partage annulé ou erreur:', err);
			}
		} else {
			// Option de secours si le navigateur est trop vieux
			alert("Le partage n'est pas supporté sur ce navigateur. Voici les résultats :\n\n" + message);
		}
	};

export const exportAsImage = async (idCapture: string) => {
	const node = document.getElementById(idCapture);
	if (!node) return;

	const dataUrl = await toPng(node, {
		quality: 0.95,
		width: node.scrollWidth + 10,
		height: node.scrollHeight + 10
	});

	// Téléchargement
	const link = document.createElement('a');
	link.download = `carte-score.png`;
	link.href = dataUrl;
	link.click();
};

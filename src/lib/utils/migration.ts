export const CURRENT_VERSION = '0.1.0';

export const checkDataVersion = () => {
	const savedVersion = localStorage.getItem('popscores_version');

	if (savedVersion != CURRENT_VERSION) {
		console.log(`Ancienne version détectée (${savedVersion}). Nettoyage ...`);

		// Lister les clés à conserver
		// const theme = localStorage.getItem("golf-app-theme");

		localStorage.clear();

		// Recharger les clés à conserver
		//if (theme) localStorage.setItem('theme', theme);

		// Enregistrer la nouvelle version
		localStorage.setItem('popscores_version', CURRENT_VERSION);

		return true;
	}
	return false;
};

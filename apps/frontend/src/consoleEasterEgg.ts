declare global {
	interface Window {
		__smallBreedsConsoleEggShown?: boolean;
	}
}

const dogArt = String.raw`
          00             00
       0008800       0008800
     000888888000000888888000
    0008888  000   000  8888000
    008888      111      888800
    008888   000000000   888800
    000888888888888888888888000
      00088888880008888888000
         000088      88000
            000      000
`;

export function printConsoleEasterEgg() {
	if (typeof window === "undefined" || window.__smallBreedsConsoleEggShown) {
		return;
	}

	window.__smallBreedsConsoleEggShown = true;

	console.log(
		"%cSmall Breeds%c abriu o console. Bem-vindo ao canil secreto.",
		"color:#6b4423;font-weight:800;font-size:16px;",
		"color:#6b7280;font-size:12px;",
	);
	console.log("%c" + dogArt, "color:#8b5e3c;font-family:monospace;");
	console.log(
		"%cDica:%c se encontrou este cachorro numérico, já faz parte da matilha.",
		"color:#b45309;font-weight:700;",
		"color:#4b5563;",
	);
}

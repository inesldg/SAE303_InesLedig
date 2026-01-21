// Ici on récupère le header
var header = document.getElementById('header');

// Et ici on surveille le scroll
window.onscroll = function () {
    if (window.scrollY > 0) {
        header.classList.add('scrolled'); // ajoute la classe si on descend
    } else {
        header.classList.remove('scrolled'); // et enleve la classe si on remonte
    }
};

//Exemple de fonctionnement proposé par Maxence le meilleur: 
//TESTS
// fetch('../json/datas.json')
//     .then(

// )

// let stat = 50
// let couleur1 = "#ff00c8"
// let couleur2 = "#00b3ff"

// for (i = 1; i < 100; i++) {
//     if (i < 50) {
//         // couleur bleu 
//     }
//     else {

//     }
// }





////// GRAPHIQUE AVEC LES SIEGES //////


let couleur1 = "#E63946";
let couleur2 = "#8B0000";
// let groupe1 = 0; à enlever

// Quand l'utilisateur clique sur le bouton "Appliquer critères" alors le script s'exécute 
document.getElementById("appliquer").addEventListener("click", () => {

    // on récupère l'année choisie et on la transforme en nombre
    const annee = parseInt(document.getElementById("annee").value);
    // radio choisie par l'utilisateur -> on récupère la valeur du critère OU message d'erreur si aucun sélectionné
    const critereInput = document.querySelector('input[name="critere"]:checked');
    if (!critereInput) {
        alert("Veuillez choisir un critère !");
        return;
    }
    const critere = critereInput.value;

    // On charge le json et on réupère ses données pour les stocker dans data
    fetch('../json/data.json')
        .then(res => res.json())
        .then(data => {
            console.log("Data chargée:", data);

            let critere = document.querySelector('input[name="critere"]:checked').value;
            // Je définit categorie avec la seule partie de mon json qui m'intéresse pour ce graphique: la structure du public
            // Ensuite on cherche la ligne qui correspond aux critères choisit (si rien trouvé alors on arrête)
            let categorie = "structure_public(%)";
            const dataAnnee = data[categorie][critere].find(item => item.Année === annee);

            if (!dataAnnee) {
                alert("Données non trouvées pour cette année !");
                return;
            }

            // Mon svg compte 100 sieges donc ici on les définit et on les répartit selon les pourcentages
            // La logique: les count1 prennent un certain % et les count2 le reste
            const totalSieges = 100;
            let count1 = 0;
            let count2 = 0;

            if (critere === "genre") {
                count1 = Math.round(dataAnnee.Femme / 100 * totalSieges);
                count2 = totalSieges - count1;

                // comme ici on a plusieurs catégories, on en aditionne plusieurs ensembles
                // pour en former seulement 2 (les moins de 34 ans et les + de 35)
            } else if (critere === "age") {
                groupe1 =
                    dataAnnee["3/10 ans"] +
                    dataAnnee["11/14 ans"] +
                    dataAnnee["15/19 ans"] +
                    dataAnnee["20/24 ans"] +
                    dataAnnee["25/34 ans"];

                count1 = Math.round(groupe1 / 100 * totalSieges);
                count2 = totalSieges - count1;

                // pareil ici on aditionne plusieurs catégories
            } else if (critere === "csp") {
                groupe1 =
                    dataAnnee["CSP+"] +
                    dataAnnee["Chefs / cadres"] +
                    dataAnnee["Professions intermédiaires"] +
                    dataAnnee["Artisans / commerçants"];

                count1 = Math.round(groupe1 / 100 * totalSieges);
                count2 = totalSieges - count1;

                // toujours pareil pour ici
            } else if (critere === "habitat") {
                groupe1 =
                    dataAnnee["zones rurales"] +
                    dataAnnee["agglo <20k"] +
                    dataAnnee["agglo 20-50k"];

                count1 = Math.round(groupe1 / 100 * totalSieges);
                count2 = totalSieges - count1;

            } else {
                count1 = Math.round(totalSieges / 2);
                count2 = totalSieges - count1;
            }

            // Ici on parcourt chaque siège, chacun a un ID (dans ce format siege-1, siege-2...)
            // On reprends le système d'avant, les count1 prennent une couleur et les count2 une autre, ce qui fait la délimitation dans le graphique
            for (let i = 1; i <= totalSieges; i++) {
                const siege = document.getElementById(`siege-${i}`);
                if (!siege) continue;

                const color = i <= count1 ? couleur1 : couleur2;

                // modifie TOUS les path du svg (pour la couleur)
                siege.querySelectorAll("path").forEach(p => p.setAttribute("fill", color));
            }


            //Script qui fait fonctionner la légende dynamique sur le côté droit du graphique

            // On récupère les éléments de la légende, puis on fait en sorte que les pastilles de couleurs s'adaptent à chaque groupe
            const legendeTexte = document.getElementById("legende-texte");
            const label1 = document.getElementById("label1");
            const label2 = document.getElementById("label2");
            color1.style.backgroundColor = couleur1;
            color2.style.backgroundColor = couleur2;

            // On récupère le bon pourcentage selon le critère choisit pour l'afficher
            if (critere === "genre") {
                legendeTexte.textContent =
                    "Répartition des femmes et des hommes parmi les personnes ayant été au cinéma au moins une fois en France.";

                label1.textContent = `Femmes : ${dataAnnee.Femme}%`;
                label2.textContent = `Hommes : ${dataAnnee.Homme}%`;

            } else if (critere === "age") {
                legendeTexte.textContent =
                    "Répartition du public selon l'âge des personnes ayant été au cinéma.";

                label1.textContent = `Jeunes (3–34 ans) : ${groupe1.toFixed(1)}%`;
                label2.textContent = `Adultes + seniors (35 ans et +) : ${(100 - groupe1).toFixed(1)}%`;

            } else if (critere === "csp") {
                legendeTexte.textContent =
                    "Répartition du public selon la catégorie socio-professionnelle.";

                label1.textContent = `CSP favorisées : ${groupe1.toFixed(1)}%`;
                label2.textContent = `Autres catégories : ${(100 - groupe1).toFixed(1)}%`;

            } else if (critere === "habitat") {
                legendeTexte.textContent =
                    "Répartition du public selon le lieu d'habitation.";

                label1.textContent = `Petites et moyennes villes : ${groupe1.toFixed(1)}%`;
                label2.textContent = `Grandes villes : ${(100 - groupe1).toFixed(1)}%`;
            }
        })
        .catch(err => console.error(err));
});




////// GRAPHIQUE AVEC BARRES GÉNÉRÉES EN JS (createElementNS) //////
// Tout n'est pas en createElement, les barres seulements, les axes sont des svg que j'ai importé de Figma même si j'aurai pu faire autrement

// Définition du namespace SVG qui est essentiel pour le createElementNS
const SVG_NS = "http://www.w3.org/2000/svg";

// On récupère le fichier json, et on le transsforme en objet JS qu'on peut maintenant 
// utiliser -> data contient tout le contenu du json
fetch("../json/data.json")
    .then(res => res.json())
    .then(data => {

        // Ici on récupère une partie du json dans ageArray qui est un tableau avec les âges
        // Puis avec map on parcourt chaque ligne du tableau pour sélectionner seulement les valeurs
        // voulues (ici: 15/19 ans et 35/49 ans). On récupère également l'année correspondant
        // Résultat : valeurs devient un tableau qui contient l'année et la valeur correspondant pour
        //les 15/1 ans et les 35/49 ans
        const ageArray = data["taux_penetration(%)"].age;
        const valeurs = ageArray.map(item => ({
            annee: item.Année,
            tranche1: item["15/19 ans"],
            tranche2: item["35/49 ans"]
        }));

        // Mainetannt on envoie les données du tableau à cette fonction qui sert à dessiner les barres
        drawBars(valeurs);
    })
    .catch(err => console.error(err));


// Définition de la fonction en question qui permet de dessiner les barres dynamiques
function drawBars(valeurs) {
    // On récupère le svg puis on définit ses paramètres (position, hauteur, largeur, etc)
    const SVG_NS = "http://www.w3.org/2000/svg";
    const svg = document.getElementById("age-chart");
    const barWidth = 26;
    const spacing = 34;
    const maxHeight = 440;
    const baseY = 465;
    const margeGauche = 165;

    valeurs.forEach((item, i) => {

        // Barre des 15/19 ans
        // Création du rectangle et définition de ses paramètres du style couleur, hauteur, position etc
        const bar1 = document.createElementNS(SVG_NS, "rect");
        const height1 = (item.tranche1 / 100) * maxHeight;
        bar1.setAttribute("x", 50 + i * (2 * barWidth + spacing));
        bar1.setAttribute("y", baseY - height1);
        bar1.setAttribute("width", barWidth);
        bar1.setAttribute("height", height1);
        bar1.setAttribute("x", margeGauche + i * (2 * barWidth + spacing));
        bar1.setAttribute("fill", "#E63946"); // couleur tranche 1
        bar1.classList.add("bar");
        svg.appendChild(bar1);

        // Barre des 35/49 ans
        // Création du rectangle et définition de ses paramètres du style couleur, hauteur, position etc
        const bar2 = document.createElementNS(SVG_NS, "rect");
        const height2 = (item.tranche2 / 100) * maxHeight;
        bar2.setAttribute("x", 50 + i * (2 * barWidth + spacing) + barWidth);
        bar2.setAttribute("y", baseY - height2);
        bar2.setAttribute("width", barWidth);
        bar2.setAttribute("height", height2);
        bar2.setAttribute("x", margeGauche + i * (2 * barWidth + spacing) + barWidth);
        bar2.classList.add("bar");
        bar2.setAttribute("fill", "#8B0000"); // couleur tranche 2
        svg.appendChild(bar2);

        // Texte au-dessus des barres
        [{ val: item.tranche1, x: 50 + i * (2 * barWidth + spacing) },
        { val: item.tranche2, x: 50 + i * (2 * barWidth + spacing) + barWidth }].forEach(t => {
            const text = document.createElementNS(SVG_NS, "text");
            text.setAttribute("x", t.x + barWidth / 2);
            text.setAttribute("y", baseY - (t.val / 100) * maxHeight - 5);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("fill", "#ffffff");
            text.setAttribute("x", margeGauche + i * (2 * barWidth + spacing) + barWidth);
            text.textContent = t.val.toFixed(1) + "%";

            svg.appendChild(text);
        });
    });
}
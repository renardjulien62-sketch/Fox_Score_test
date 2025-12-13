// =============================================================
// 1. VARIABLES GLOBALES
// =============================================================
let joueurs = [];
let scoresSecrets = false;
let mancheActuelle = 0;
let lowScoreWins = true;
let monGraphique = null;
let classementFinal = [];
let nomJeuActuel = "Partie";
let categoriesJeuxConnues = []; 
let joueursRecents = []; 
let allHistoryData = []; 
let mesAmis = []; 

let monGraphiquePosition = null;
let joueursSurGraphique = [];
const COULEURS_GRAPH = ['#36A2EB', '#FF6384', '#4BC0C0', '#FFCE56', '#9966FF', '#FF9F40'];

let sequenceForceStop = false;
let currentStepSkipper = null;

let conditionsArret = {
    score_limite: { active: false, valeur: 0 },
    score_relatif: { active: false, valeur: 0 },
    manche_total: { active: false, mancheCible: 0 },
    manche_restante: { active: false, mancheCible: 0 }
};

const inputIdMap = {
    'score_limite': 'score-limite',
    'score_relatif': 'score-relatif',
    'manche_total': 'nb-manches-total',
    'manche_restante': 'nb-manches-restantes'
};

// Init Firebase
const auth = firebase.auth(); 
let partieIdActuelle = null; // C'est ici que tout se joue : l'ID unique de la partie en cours
let currentUser = null;

// =============================================================
// 2. SÉLECTION DES ÉLÉMENTS HTML (DOM)
// =============================================================
// Auth
const authEcran = document.getElementById('auth-ecran');
const authErreur = document.getElementById('auth-erreur');
const btnShowLogin = document.getElementById('btn-show-login');
const btnShowSignup = document.getElementById('btn-show-signup');
const formLogin = document.getElementById('form-login');
const formSignup = document.getElementById('form-signup');
const authButtonsStart = document.getElementById('auth-choice');
const btnBackFromLogin = document.getElementById('back-to-choice-1');
const btnBackFromSignup = document.getElementById('back-to-choice-2');
const submitLogin = document.getElementById('perform-login');
const submitSignup = document.getElementById('perform-signup');

// Nav & Layout
const appLayout = document.getElementById('app-layout');
const navUserProfile = document.getElementById('nav-user-pseudo');
const logoutBtn = document.getElementById('auth-logout');
const navLinks = document.querySelectorAll('.nav-link');
const allPages = document.querySelectorAll('.page-content');

// Pages
const historyGridJeux = document.getElementById('history-grid-jeux');
const historyDetailsTitle = document.getElementById('history-details-title');
const historyBackBtn = document.getElementById('history-back-btn');
const listeHistoriquePartiesDetails = document.getElementById('liste-historique-parties-details');
const listePartiesSauvegardees = document.getElementById('liste-parties-sauvegardees');
const friendsListContainer = document.getElementById('friends-list-container');

// Inputs Jeu
const nomJeuConfigInput = document.getElementById('nom-jeu-config');
const datalistJeux = document.getElementById('datalist-jeux');
const nomJoueurInput = document.getElementById('nom-joueur');
const couleurJoueurInput = document.getElementById('couleur-joueur');
const selectAmiAjout = document.getElementById('select-ami-ajout');

// Boutons Jeu
const ajouterBouton = document.getElementById('ajouter-joueur');
const demarrerBouton = document.getElementById('demarrer-partie');
const validerTourBouton = document.getElementById('valider-tour');
const annulerTourBouton = document.getElementById('annuler-tour');
const sauvegarderBtn = document.getElementById('sauvegarder-partie');
const arreterMaintenantBouton = document.getElementById('arreter-maintenant');
const saveFeedback = document.getElementById('save-feedback');

// Zones Affichage
const suggestionsJoueursDiv = document.getElementById('suggestions-joueurs');
const listeSuggestionsJoueurs = document.getElementById('liste-suggestions-joueurs');
const listeJoueursConf = document.getElementById('liste-joueurs-conf');
const scoreAffichageDiv = document.getElementById('score-affichage');
const saisiePointsDiv = document.getElementById('saisie-points');
const canvasGraphique = document.getElementById('graphique-scores');
const manchesPasseesAffichage = document.getElementById('manches-passees');
const manchesRestantesAffichageDiv = document.getElementById('manches-restantes-affichage');
const manchesRestantesAffichage = document.getElementById('manches-restantes');
const pointsRestantsAffichageDiv = document.getElementById('points-restants-affichage');
const pointsRestantsAffichage = document.getElementById('points-restants');

// Configs & Reveal
const modeSecretConfig = document.getElementById('mode-secret-config');
const conditionCheckboxes = document.querySelectorAll('.condition-checkbox');
const scoreLimiteInput = document.getElementById('score-limite');
const scoreRelatifInput = document.getElementById('score-relatif');
const nbManchesTotalInput = document.getElementById('nb-manches-total');
const nbManchesRestantesInput = document.getElementById('nb-manches-restantes');
const revealEcran = document.getElementById('reveal-ecran');
const revealContent = document.getElementById('reveal-content');
const revealRang = document.getElementById('reveal-rang');
const revealNom = document.getElementById('reveal-nom');
const revealNomPlaceholder = document.getElementById('reveal-nom-placeholder');
const revealScore = document.getElementById('reveal-score');
const skipAllBtn = document.getElementById('skip-all-btn');
const retourAccueilBtn = document.getElementById('retour-accueil-btn');

// Stats
const historyPlayerSelect = document.getElementById('history-player-select');
const canvasGraphiquePosition = document.getElementById('graphique-position-details');
const statsTopJeuxListe = document.querySelector('#stats-top-jeux ol');
const statsJeuxFrequenceListe = document.querySelector('#stats-jeux-frequence ol');
const statsJoueursPodiumListe = document.querySelector('#stats-joueurs-podium ol');
const addPlayerToGraphBtn = document.getElementById('add-player-to-graph-btn');
const graphPlayersList = document.getElementById('graph-players-list');

// Amis & Profil Inputs
const friendEmailInput = document.getElementById('friend-email-input');
const friendNicknameInput = document.getElementById('friend-nickname-input');
const friendColorInput = document.getElementById('friend-color-input');
const btnAddFriend = document.getElementById('btn-add-friend');
const friendAddMsg = document.getElementById('friend-add-msg');
const profilePseudoInput = document.getElementById('profile-pseudo');
const profileColorInput = document.getElementById('profile-color');
const profileNewPassInput = document.getElementById('profile-new-password');
const btnUpdateProfile = document.getElementById('btn-update-profile');
const btnUpdatePassword = document.getElementById('btn-update-password');
const profileMsg = document.getElementById('profile-msg');


// =============================================================
// 3. NAVIGATION & UI
// =============================================================
function showPage(pageId) {
    allPages.forEach(page => page.classList.add('cache'));
    const pageToShow = document.getElementById(pageId);
    if (pageToShow) {
        pageToShow.classList.remove('cache');
    }
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
    });
    if (pageId === 'page-history-details') {
        document.querySelector('.nav-link[data-page="page-history-grid"]').classList.add('active');
    }
}
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(link.dataset.page);
    });
});

function afficherAuthErreur(message) { 
    authErreur.textContent = message; 
    authErreur.classList.remove('cache'); 
}

// =============================================================
// 4. AUTHENTIFICATION
// =============================================================
btnShowLogin.onclick = () => { authButtonsStart.classList.add('cache'); formLogin.classList.remove('cache'); authErreur.classList.add('cache'); };
btnShowSignup.onclick = () => { authButtonsStart.classList.add('cache'); formSignup.classList.remove('cache'); authErreur.classList.add('cache'); };
btnBackFromLogin.onclick = () => { formLogin.classList.add('cache'); authButtonsStart.classList.remove('cache'); authErreur.classList.add('cache'); };
btnBackFromSignup.onclick = () => { formSignup.classList.add('cache'); authButtonsStart.classList.remove('cache'); authErreur.classList.add('cache'); };

submitSignup.addEventListener('click', () => { 
    const email = document.getElementById('signup-email').value; 
    const password = document.getElementById('signup-password').value;
    const pseudo = document.getElementById('signup-pseudo').value;
    const couleur = document.getElementById('signup-color').value;

    if(!email || !password || !pseudo) { afficherAuthErreur("Veuillez remplir tous les champs."); return; }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            creerProfilPublic(user, pseudo, couleur);
            db.collection('utilisateurs').doc(user.uid).set({ pseudo: pseudo, couleur: couleur }, { merge: true });
        })
        .catch(err => { afficherAuthErreur(err.message); }); 
});

function creerProfilPublic(user, pseudo, couleur) {
    db.collection('users_public').doc(user.uid).set({
        email: user.email, uid: user.uid, pseudo: pseudo, couleur: couleur
    }).catch(err => console.error("Erreur profil public", err));
}

submitLogin.addEventListener('click', () => { 
    const email = document.getElementById('login-email').value; 
    const password = document.getElementById('login-password').value; 
    auth.signInWithEmailAndPassword(email, password).catch(err => { afficherAuthErreur(err.message); }); 
});

logoutBtn.addEventListener('click', () => { auth.signOut(); });

auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        authEcran.classList.add('cache');
        appLayout.classList.remove('cache'); 
        
        db.collection('utilisateurs').doc(user.uid).get().then(doc => {
            let pseudoAffiche = user.email;
            let couleurAffiche = "#e67e22";
            if(doc.exists) {
                const data = doc.data();
                if(data.pseudo) pseudoAffiche = data.pseudo;
                if(data.couleur) couleurAffiche = data.couleur;
            } else {
                creerProfilPublic(user, user.email.split('@')[0], genererCouleurAleatoire());
            }
            navUserProfile.textContent = pseudoAffiche;
            profilePseudoInput.value = pseudoAffiche;
            profileColorInput.value = couleurAffiche;
        });

        chargerListeParties();
        chargerHistoriqueParties();
        chargerCategoriesConnues();
        chargerJoueursRecents();
        chargerAmis(); 
        
        showPage('page-new-game'); 
    } else {
        currentUser = null;
        authEcran.classList.remove('cache');
        appLayout.classList.add('cache');
        formLogin.classList.add('cache');
        formSignup.classList.add('cache');
        authButtonsStart.classList.remove('cache');
    }
});

// =============================================================
// 5. GESTION DU PROFIL
// =============================================================
btnUpdateProfile.addEventListener('click', () => {
    if(!currentUser) return;
    const newPseudo = profilePseudoInput.value.trim();
    const newColor = profileColorInput.value;
    if(!newPseudo) { alert("Le pseudo ne peut pas être vide"); return; }
    const userRef = db.collection('utilisateurs').doc(currentUser.uid);
    const publicRef = db.collection('users_public').doc(currentUser.uid);

    userRef.set({ pseudo: newPseudo, couleur: newColor }, { merge: true })
    .then(() => publicRef.set({ pseudo: newPseudo, couleur: newColor }, { merge: true }))
    .then(() => {
        navUserProfile.textContent = newPseudo;
        profileMsg.textContent = "Profil mis à jour !";
        profileMsg.style.color = "green";
        profileMsg.classList.remove('cache');
        setTimeout(() => profileMsg.classList.add('cache'), 3000);
    });
});

btnUpdatePassword.addEventListener('click', () => {
    const newPass = profileNewPassInput.value;
    if(!newPass || newPass.length < 6) { alert("Min 6 caractères."); return; }
    if(currentUser) {
        currentUser.updatePassword(newPass).then(() => {
            profileMsg.textContent = "Mot de passe modifié !";
            profileMsg.style.color = "green";
            profileMsg.classList.remove('cache');
            profileNewPassInput.value = "";
        }).catch((err) => {
            profileMsg.textContent = "Erreur (Reconnectez-vous).";
            profileMsg.style.color = "red";
            profileMsg.classList.remove('cache');
        });
    }
});

// =============================================================
// 6. LOGIQUE JEU & CORRECTION DOUBLONS
// =============================================================

function genererCouleurAleatoire() { return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'); }

ajouterBouton.addEventListener('click', () => {
    let nom = nomJoueurInput.value.trim();
    let couleur = couleurJoueurInput.value;
    let uidAmi = null;

    const selectedAmiIndex = selectAmiAjout.selectedIndex;
    if (selectedAmiIndex > 0) { 
        const option = selectAmiAjout.options[selectedAmiIndex];
        nom = option.text; uidAmi = option.value; 
        if (option.dataset.couleur) couleur = option.dataset.couleur;
    }

    if (nom && !joueurs.some(j => j.nom === nom)) {
        joueurs.push({ nom: nom, couleur: couleur, scoreTotal: 0, scoresTour: [], rang: null, uid: uidAmi });
        nomJoueurInput.value = '';
        couleurJoueurInput.value = genererCouleurAleatoire();
        selectAmiAjout.value = ""; 
        mettreAJourListeJoueurs();
        verifierPeutDemarrer();
    }
});

selectAmiAjout.addEventListener('change', () => {
    const idx = selectAmiAjout.selectedIndex;
    if (idx > 0) {
        const option = selectAmiAjout.options[idx];
        if (option.dataset.couleur) couleurJoueurInput.value = option.dataset.couleur;
    } else {
        couleurJoueurInput.value = genererCouleurAleatoire();
    }
});

function mettreAJourListeJoueurs() { 
    listeJoueursConf.innerHTML = ''; 
    if (joueurs.length === 0) { listeJoueursConf.innerHTML = '<p>Ajoutez au moins deux joueurs.</p>'; return; } 
    joueurs.forEach((joueur, index) => { 
        const tag = document.createElement('div'); tag.className = 'joueur-tag'; 
        tag.innerHTML = `<span class="joueur-couleur-swatch" style="background:${joueur.couleur}"></span>${joueur.nom} <button class="bouton-retirer">&times;</button>`;
        tag.querySelector('button').onclick = () => { joueurs.splice(index, 1); mettreAJourListeJoueurs(); verifierPeutDemarrer(); };
        listeJoueursConf.appendChild(tag); 
    }); 
}

function verifierPeutDemarrer() { demarrerBouton.disabled = joueurs.length < 2; }

// --- DÉMARRAGE PARTIE (FIX DOUBLONS) ---
demarrerBouton.addEventListener('click', () => {
    sequenceForceStop = false; 
    if (joueurs.length < 2) return; 
    
    // IMPORTANT : On force l'ID à null car c'est une NOUVELLE partie.
    // Cela garantit qu'on ne va pas écraser une ancienne partie chargée, 
    // et qu'une nouvelle sauvegarde sera créée.
    partieIdActuelle = null; 

    nomJeuActuel = nomJeuConfigInput.value.trim() || "Partie";
    scoresSecrets = modeSecretConfig.checked; 
    const victoireChoix = document.querySelector('input[name="condition-victoire"]:checked').value; 
    lowScoreWins = (victoireChoix === 'low'); 
    mancheActuelle = 0;
    
    // Reset scores
    joueurs.forEach(j => { j.scoreTotal = 0; j.scoresTour = []; j.rang = null; }); 
    
    // Sauvegarde joueurs récents
    if (currentUser) {
        const userRef = db.collection('utilisateurs').doc(currentUser.uid);
        joueurs.forEach(j => {
            userRef.collection('joueursRecents').doc(j.nom).set({ nom: j.nom, couleur: j.couleur });
        });
        chargerJoueursRecents();
    }
    
    // UI Setup
    const graphContainer = document.querySelector('.graphique-container'); 
    const graphOriginalParent = document.getElementById('page-score').querySelector('.score-gauche');
    const inputTourDiv = document.getElementById('page-score').querySelector('.input-tour');
    if (graphContainer && graphOriginalParent && inputTourDiv) { graphOriginalParent.insertBefore(graphContainer, inputTourDiv); }
    if (scoresSecrets) graphContainer.classList.add('cache'); else graphContainer.classList.remove('cache');
    
    mettreAJourConditionsArret(); 
    showPage('page-score');
    genererChampsSaisie(); 
    mettreAJourScoresAffichage(); 
    mettreAJourCompteurs(); 
    creerGraphique();
    
    // Première sauvegarde
    sauvegarderPartieEnCours(true);
});

// --- SAUVEGARDE EN COURS (FIX DOUBLONS) ---
async function sauvegarderPartieEnCours(isNew = false) {
    if (!currentUser) return;
    if (validerTourBouton.disabled && !isNew) return; // Partie finie

    const etatPartie = { 
        joueurs, mancheActuelle, scoresSecrets, lowScoreWins, conditionsArret, 
        nomJeuActuel, // Important pour l'affichage dans la liste
        dernierSauvegarde: new Date().toISOString() 
    }; 
    
    const userRef = db.collection('utilisateurs').doc(currentUser.uid); 
    const partiesRef = userRef.collection('parties'); 
    
    sauvegarderBtn.disabled = true; 
    saveFeedback.textContent = "Sauvegarde..."; 
    saveFeedback.classList.remove('cache'); 
    
    try { 
        // Si on a déjà un ID, on met à jour le MEME document
        if (partieIdActuelle) { 
            await partiesRef.doc(partieIdActuelle).set(etatPartie, { merge: true }); 
        } else { 
            // Sinon (Nouvelle partie), on en crée un et on GARDE l'ID
            const docRef = await partiesRef.add(etatPartie); 
            partieIdActuelle = docRef.id; 
        } 
        saveFeedback.textContent = "Sauvegardé !"; 
        setTimeout(() => saveFeedback.textContent = "", 2000); 
        chargerListeParties(); // Met à jour la liste visuelle
    } catch (err) { 
        console.error("Erreur save: ", err); 
        saveFeedback.textContent = "Erreur."; 
    } finally { 
        sauvegarderBtn.disabled = false; 
    }
}

// --- CHARGEMENT LISTE PARTIES ---
function chargerListeParties() { 
    if (!currentUser) return; 
    const userRef = db.collection('utilisateurs').doc(currentUser.uid); 
    listePartiesSauvegardees.innerHTML = "Chargement..."; 
    
    userRef.collection('parties').orderBy('dernierSauvegarde', 'desc').get() 
    .then(querySnapshot => { 
        if (querySnapshot.empty) { listePartiesSauvegardees.innerHTML = "<p>Aucune partie en cours.</p>"; return; } 
        listePartiesSauvegardees.innerHTML = ""; 
        
        querySnapshot.forEach(doc => { 
            const partie = doc.data(); 
            const nomsJoueurs = partie.joueurs ? partie.joueurs.map(j => j.nom).join(', ') : "Inconnu"; 
            const nomJeu = partie.nomJeuActuel || "Jeu";
            
            const div = document.createElement('div'); 
            div.innerHTML = ` 
                <div class="partie-historique"> 
                    <div class="header-info"> 
                        <span style="font-size:1em;"><strong>${nomJeu}</strong> - Manche ${partie.mancheActuelle} <br><span style="font-size:0.8em; color:#666;">${nomsJoueurs}</span></span> 
                        <div class="action-buttons"> 
                            <button class="charger-btn" data-id="${doc.id}" style="background-color: #28a745;">Reprendre</button> 
                            <button class="supprimer-btn" data-id="${doc.id}" style="background-color: #dc3545;">&times;</button> 
                        </div> 
                    </div> 
                </div> 
            `; 
            listePartiesSauvegardees.appendChild(div); 
        }); 
    }); 
}

// Clic sur "Reprendre" ou "Supprimer"
listePartiesSauvegardees.addEventListener('click', e => { 
    const target = e.target; 
    const id = target.dataset.id; 
    if (!id || !currentUser) return; 
    
    const partieRef = db.collection('utilisateurs').doc(currentUser.uid).collection('parties').doc(id); 
    
    if (target.classList.contains('charger-btn')) { 
        partieRef.get().then(doc => { 
            if (doc.exists) { 
                const etatPartie = doc.data(); 
                // ON RÉCUPÈRE L'ID pour continuer de sauvegarder sur le même doc
                partieIdActuelle = doc.id; 
                
                joueurs = etatPartie.joueurs; 
                mancheActuelle = etatPartie.mancheActuelle; 
                scoresSecrets = etatPartie.scoresSecrets; 
                lowScoreWins = etatPartie.lowScoreWins; 
                conditionsArret = etatPartie.conditionsArret || conditionsArret; 
                nomJeuActuel = etatPartie.nomJeuActuel || "Partie";

                showPage('page-score'); 
                validerTourBouton.disabled = false; 
                arreterMaintenantBouton.disabled = false; 
                
                // Restauration Checkboxes
                document.querySelectorAll('.condition-checkbox').forEach(cb => { 
                    const type = cb.dataset.type; 
                    if (conditionsArret[type]) { 
                        cb.checked = conditionsArret[type].active; 
                        const input = document.getElementById(inputIdMap[type]); 
                        if(input) { 
                            input.disabled = !cb.checked; 
                            if (type === 'manche_total') input.value = conditionsArret[type].mancheCible; 
                            else if(type.includes('score')) input.value = conditionsArret[type].valeur;
                        } 
                    } 
                }); 
                
                genererChampsSaisie(); 
                mettreAJourScoresAffichage(); 
                creerGraphique(); 
                
                // Restauration Graphique
                if (!scoresSecrets && monGraphique) { 
                     monGraphique.data.labels = ['Manche 0'];
                     joueurs.forEach((j, idx) => {
                         let cum = 0;
                         const data = [0];
                         j.scoresTour.forEach(s => { cum += s; data.push(cum); });
                         if(monGraphique.data.datasets[idx]) monGraphique.data.datasets[idx].data = data;
                     });
                     for(let i=1; i<=mancheActuelle; i++) if(monGraphique.data.labels.length <= i) monGraphique.data.labels.push(`Manche ${i}`);
                     monGraphique.update(); 
                } 
                mettreAJourCompteurs(); 
            } 
        }); 
    } else if (target.classList.contains('supprimer-btn')) { 
        if (confirm("Supprimer cette partie ?")) { 
            partieRef.delete().then(() => { chargerListeParties(); }); 
        } 
    } 
});

// --- IN-GAME ACTIONS ---
validerTourBouton.addEventListener('click', () => { 
    if (validerTourBouton.disabled) return; 
    mancheActuelle++; 
    joueurs.forEach((joueur, index) => { 
        const inputElement = document.getElementById(`score-${index}`); 
        const points = parseInt(inputElement.value, 10) || 0; 
        joueur.scoreTotal += points; 
        joueur.scoresTour.push(points); 
        inputElement.value = 0; 
    }); 
    mettreAJourScoresAffichage(); 
    mettreAJourCompteurs(); 
    mettreAJourGraphique(); 
    verifierConditionsArret(); 
    
    // Sauvegarde sur le même ID
    sauvegarderPartieEnCours();
});

annulerTourBouton.addEventListener('click', () => {
    if (mancheActuelle > 0 && confirm("Annuler le dernier tour ?")) {
        mancheActuelle--;
        joueurs.forEach((joueur, index) => {
            const dernierScore = joueur.scoresTour.pop();
            if (dernierScore !== undefined) {
                joueur.scoreTotal -= dernierScore;
                const inputElement = document.getElementById(`score-${index}`);
                if (inputElement) inputElement.value = dernierScore;
            }
        });
        if (monGraphique) {
            monGraphique.data.labels.pop(); 
            monGraphique.data.datasets.forEach(ds => ds.data.pop()); 
            monGraphique.update();
        }
        mettreAJourScoresAffichage();
        mettreAJourCompteurs();
        sauvegarderPartieEnCours();
    }
});

// --- FIN DE PARTIE & NETTOYAGE (FIX PERSISTANCE) ---
arreterMaintenantBouton.addEventListener('click', terminerPartie);

async function terminerPartie() { 
    sequenceForceStop = false; 
    validerTourBouton.disabled = true; 
    arreterMaintenantBouton.disabled = true; 
    
    // Calcul classement
    let joueursTries = [...joueurs].sort((a, b) => lowScoreWins ? a.scoreTotal - b.scoreTotal : b.scoreTotal - a.scoreTotal); 
    classementFinal = calculerRangs(joueursTries); 
    
    // Sauvegarde Historique ET Nettoyage
    await sauvegarderHistoriquePartie(classementFinal); 
    
    // Animation Fin
    const graphContainer = document.querySelector('.graphique-container'); 
    if (graphContainer) graphContainer.classList.remove('cache'); 
    
    if (scoresSecrets) { 
        scoresSecrets = false; 
        mettreAJourScoresAffichage(); 
        // Update graph complet
        // ... (Logique graph full)
        alert("Scores révélés !"); 
        setTimeout(demarrerSequenceReveal, 100); 
    } else { 
        mettreAJourScoresAffichage(); 
        demarrerSequenceReveal(); 
    } 
}

async function sauvegarderHistoriquePartie(classement) { 
    if (!currentUser) return; 
    const entreeHistorique = { date: new Date().toISOString(), nomJeu: nomJeuActuel, classement: classement, joueursComplets: joueurs, manches: mancheActuelle, lowScoreWins: lowScoreWins }; 
    
    const userRef = db.collection('utilisateurs').doc(currentUser.uid); 
    
    try { 
        // 1. Save History
        await userRef.collection('historique').add(entreeHistorique); 
        
        // 2. Save for Friends
        for (const joueur of joueurs) {
            if (joueur.uid && joueur.uid !== currentUser.uid) {
                try { await db.collection('utilisateurs').doc(joueur.uid).collection('historique').add(entreeHistorique); } catch(e){}
            }
        }
        
        // 3. NETTOYAGE PARTIE EN COURS (CRITIQUE)
        if (partieIdActuelle) { 
            await userRef.collection('parties').doc(partieIdActuelle).delete(); 
            console.log("Partie en cours supprimée : " + partieIdActuelle);
            partieIdActuelle = null; // On vide l'ID pour ne pas re-sauvegarder dessus
            chargerListeParties(); 
        } 
        
        // Update Datalist
        if (!categoriesJeuxConnues.includes(nomJeuActuel)) { categoriesJeuxConnues.push(nomJeuActuel); mettreAJourDatalistJeux(); } 
        chargerHistoriqueParties(); 

    } catch (err) { console.error("Erreur historique/nettoyage: ", err); } 
}

// --- RESTE DU CODE (Graphiques, Listes, Reveal, Utils) ---
// (Ces fonctions sont standard et ne causaient pas le bug)

function genererChampsSaisie() { saisiePointsDiv.innerHTML = ''; joueurs.forEach((joueur, index) => { const div = document.createElement('div'); div.className = 'saisie-item'; div.innerHTML = ` <label for="score-${index}"> <span class="score-couleur-swatch" style="background-color: ${joueur.couleur};"></span> ${joueur.nom} : </label> <input type="number" id="score-${index}" value="0"> `; saisiePointsDiv.appendChild(div); }); }
function mettreAJourScoresAffichage() { scoreAffichageDiv.innerHTML = ''; let listePourAffichage = []; if (!scoresSecrets) { let joueursTries = [...joueurs].sort((a, b) => { return lowScoreWins ? a.scoreTotal - b.scoreTotal : b.scoreTotal - a.scoreTotal; }); listePourAffichage = calculerRangs(joueursTries); } else { listePourAffichage = joueurs; } let html = '<table class="classement-table">'; html += '<thead><tr><th>#</th><th>Joueur</th><th>Total</th></tr></thead>'; html += '<tbody>'; listePourAffichage.forEach((joueur) => { const rangAffichage = joueur.rang && !scoresSecrets ? joueur.rang : '-'; html += ` <tr> <td>${rangAffichage}</td> <td> <span class="score-couleur-swatch" style="background-color: ${joueur.couleur};"></span> ${joueur.nom} </td> <td class="score-total">${scoresSecrets ? '???' : `${joueur.scoreTotal} pts`}</td> </tr> `; }); html += '</tbody></table>'; scoreAffichageDiv.innerHTML = html; }
function mettreAJourCompteurs() { manchesPasseesAffichage.textContent = mancheActuelle; let restantesManches = Infinity; let afficherManchesRestantes = false; if (conditionsArret.manche_total.active) { const totalManches = conditionsArret.manche_total.mancheCible; restantesManches = Math.max(0, totalManches - mancheActuelle); afficherManchesRestantes = true; } if (conditionsArret.manche_restante.active) { const mancheCible = conditionsArret.manche_restante.mancheCible; const restantesDynamiques = Math.max(0, mancheCible - mancheActuelle); restantesManches = Math.min(restantesManches, restantesDynamiques); afficherManchesRestantes = true; } if (afficherManchesRestantes) { manchesRestantesAffichage.textContent = restantesManches; manchesRestantesAffichageDiv.classList.remove('cache'); } else { manchesRestantesAffichageDiv.classList.add('cache'); } let pointsMinRestants = Infinity; let afficherPointsRestants = false; if (conditionsArret.score_limite.active) { const scoreMax = Math.max(...joueurs.map(j => j.scoreTotal)); const restantsAbsolu = Math.max(0, conditionsArret.score_limite.valeur - scoreMax); pointsMinRestants = Math.min(pointsMinRestants, restantsAbsolu); afficherPointsRestants = true; } if (conditionsArret.score_relatif.active) { joueurs.forEach(joueur => { let limiteCible = (joueur.scoreRelatifPivot || 0) + conditionsArret.score_relatif.valeur; const restantsRelatif = Math.max(0, limiteCible - joueur.scoreTotal); pointsMinRestants = Math.min(pointsMinRestants, restantsRelatif); }); afficherPointsRestants = true; } if (afficherPointsRestants) { pointsRestantsAffichage.textContent = pointsMinRestants; pointsRestantsAffichageDiv.classList.remove('cache'); } else { pointsRestantsAffichageDiv.classList.add('cache'); } }
function verifierConditionsArret() { if (validerTourBouton.disabled) return; let doitTerminer = false; if (conditionsArret.score_limite.active && conditionsArret.score_limite.valeur > 0) { if (joueurs.some(j => j.scoreTotal >= conditionsArret.score_limite.valeur)) { doitTerminer = true; } } if (conditionsArret.score_relatif.active && conditionsArret.score_relatif.valeur > 0) { joueurs.forEach(joueur => { let limiteCible = (joueur.scoreRelatifPivot || 0) + conditionsArret.score_relatif.valeur; if (joueur.scoreTotal >= limiteCible) { doitTerminer = true; } }); } if (conditionsArret.manche_total.active && mancheActuelle >= conditionsArret.manche_total.mancheCible && conditionsArret.manche_total.mancheCible > 0) { doitTerminer = true; } if (conditionsArret.manche_restante.active && mancheActuelle >= conditionsArret.manche_restante.mancheCible && conditionsArret.manche_restante.mancheCible > 0) { doitTerminer = true; } if (doitTerminer) { terminerPartie(); } }
function construirePodiumFinal() { currentStepSkipper = null; const podiumMap = { 1: document.getElementById('podium-1'), 2: document.getElementById('podium-2'), 3: document.getElementById('podium-3') }; Object.values(podiumMap).forEach(el => el.classList.remove('cache')); const premier = classementFinal.filter(j => j.rang === 1); const deuxieme = classementFinal.filter(j => j.rang === 2); const troisieme = classementFinal.filter(j => j.rang === 3); const remplirPlace = (element, joueursPlace) => { if (joueursPlace.length > 0) { const joueurRef = joueursPlace[0]; const noms = joueursPlace.map(j => j.nom).join(' & '); element.querySelector('.podium-nom').textContent = noms; element.querySelector('.podium-score').textContent = `${joueurRef.scoreTotal} pts`; element.style.borderColor = joueurRef.couleur; element.style.boxShadow = `0 0 15px ${joueurRef.couleur}80`; } else { element.classList.add('cache'); } }; remplirPlace(podiumMap[1], premier); remplirPlace(podiumMap[2], deuxieme); remplirPlace(podiumMap[3], troisieme); const autresListe = document.getElementById('autres-joueurs-liste'); autresListe.innerHTML = ''; const autresJoueurs = classementFinal.filter(j => j.rang > 3); if(autresJoueurs.length === 0) { document.getElementById('autres-joueurs').classList.add('cache'); } else { document.getElementById('autres-joueurs').classList.remove('cache'); autresJoueurs.sort((a, b) => a.rang - b.rang); autresJoueurs.forEach((joueur) => { const li = document.createElement('li'); li.innerHTML = ` <span class="score-couleur-swatch" style="background-color: ${joueur.couleur};"></span> <strong>${joueur.rang}. ${joueur.nom}</strong> (${joueur.scoreTotal} pts) `; autresListe.appendChild(li); }); } const graphContainer = document.querySelector('.graphique-container'); const graphPlaceholder = document.getElementById('graphique-final-container'); if (graphContainer && graphPlaceholder) { graphPlaceholder.innerHTML = ''; graphPlaceholder.appendChild(graphContainer); if (monGraphique) { monGraphique.resize(); } } }
function majContenuReveal(rang, joueur, estExAequoPrecedent) { let rangTexte = `${rang}ème Place`; if (estExAequoPrecedent) { rangTexte = `Ex æquo ${rang}ème Place`; } if (rang === 3) rangTexte = `🥉 ${estExAequoPrecedent ? 'Ex æquo ' : ''}3ème Place`; if (rang === 1) rangTexte = `🥇 GAGNANT ${estExAequoPrecedent ? 'Ex æquo ' : ''}!`; revealRang.textContent = rangTexte; revealNom.textContent = joueur.nom; revealNom.style.color = joueur.couleur; revealScore.textContent = `${joueur.scoreTotal} pts`; revealContent.classList.remove('is-revealed'); }
async function demarrerSequenceReveal() { showPage('page-score'); revealEcran.classList.remove('cache'); let joueursAReveler = []; joueursAReveler.push(...classementFinal.filter(j => j.rang > 2).reverse()); joueursAReveler.push(...classementFinal.filter(j => j.rang === 1)); let rangPrecedent = null; for (const joueur of joueursAReveler) { if (sequenceForceStop) return; const rang = joueur.rang; const estExAequo = (rang === rangPrecedent); majContenuReveal(rang, joueur, estExAequo); revealContent.classList.add('slide-in-from-left'); await attendreFinAnimation(revealContent); revealContent.classList.remove('slide-in-from-left'); if (sequenceForceStop) return; await pause(1500); if (sequenceForceStop) return; revealContent.classList.add('shake-reveal'); await attendreFinAnimation(revealContent); revealContent.classList.remove('shake-reveal'); revealContent.classList.add('is-revealed'); if (sequenceForceStop) return; await pause(2500); if (sequenceForceStop) return; if (joueur !== joueursAReveler[joueursAReveler.length - 1]) { revealContent.classList.add('slide-out-to-right'); await attendreFinAnimation(revealContent); revealContent.classList.remove('slide-out-to-right', 'is-revealed'); } rangPrecedent = rang; } revealEcran.classList.add('cache'); showPage('page-podium'); construirePodiumFinal(); }
function creerGraphique() { if (monGraphique) { monGraphique.destroy(); } const datasets = joueurs.map((joueur, index) => ({ label: joueur.nom, data: [0], borderColor: joueur.couleur, backgroundColor: joueur.couleur + '33', fill: false, tension: 0.1 })); monGraphique = new Chart(canvasGraphique, { type: 'line', data: { labels: ['Manche 0'], datasets: datasets }, options: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: false } }, scales: { y: { title: { display: true, text: 'Points' } }, x: { title: { display: true, text: 'Manches' } } } } }); }
function mettreAJourGraphique() { if (!monGraphique) { return; } const labelManche = 'Manche ' + mancheActuelle; if (!monGraphique.data.labels.includes(labelManche)) { monGraphique.data.labels.push(labelManche); } joueurs.forEach((joueur, index) => { if(monGraphique.data.datasets[index]) { if (monGraphique.data.datasets[index].data.length <= mancheActuelle) { monGraphique.data.datasets[index].data.push(joueur.scoreTotal); } else { monGraphique.data.datasets[index].data[mancheActuelle] = joueur.scoreTotal; } } }); monGraphique.update(); }
function recreerGraphiqueFinal() { const graphContainer = document.querySelector('.graphique-container'); const graphPlaceholder = document.getElementById('graphique-final-container'); if (graphContainer && graphPlaceholder) { if (!graphPlaceholder.contains(graphContainer)) { graphPlaceholder.innerHTML = ''; graphPlaceholder.appendChild(graphContainer); } } if (monGraphique) { monGraphique.destroy(); } const datasets = joueurs.map((joueur, index) => ({ label: joueur.nom, data: [0], borderColor: joueur.couleur, backgroundColor: joueur.couleur + '33', fill: false, tension: 0.1 })); monGraphique = new Chart(canvasGraphique, { type: 'line', data: { labels: ['Manche 0'], datasets: datasets }, options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { title: { display: true, text: 'Points' } }, x: { title: { display: true, text: 'Manches' } } } } }); let scoreCumules = new Array(joueurs.length).fill(0); for (let i = 0; i < mancheActuelle; i++) { if(monGraphique.data.labels.length <= i + 1) { monGraphique.data.labels.push(`Manche ${i + 1}`); } joueurs.forEach((joueur, index) => { const scoreDeCeTour = (joueur.scoresTour && joueur.scoresTour[i]) ? joueur.scoresTour[i] : 0; scoreCumules[index] += scoreDeCeTour; if(monGraphique.data.datasets[index]) { monGraphique.data.datasets[index].data[i+1] = scoreCumules[index]; } }); } monGraphique.update(); monGraphique.resize(); }
function mettreAJourConditionsArret() { for (const key in conditionsArret) { conditionsArret[key].active = false; } document.querySelectorAll('.condition-checkbox:checked').forEach(checkbox => { const type = checkbox.dataset.type; conditionsArret[type].active = true; const inputId = inputIdMap[type]; const inputElement = document.getElementById(inputId); const valeur = parseInt(inputElement.value, 10) || 0; if (type === 'score_limite') { conditionsArret.score_limite.valeur = valeur; } else if (type === 'score_relatif') { conditionsArret[type].valeur = valeur; joueurs.forEach(j => { j.scoreRelatifPivot = j.scoreTotal; }); } else if (type === 'manche_total') { conditionsArret.manche_total.mancheCible = valeur; } else if (type === 'manche_restante') { conditionsArret.manche_restante.mancheCible = mancheActuelle + valeur; } }); }
conditionCheckboxes.forEach(checkbox => { checkbox.addEventListener('change', (e) => { const type = e.target.dataset.type; const inputId = inputIdMap[type]; const input = document.getElementById(inputId); if (input) { input.disabled = !checkbox.checked; } mettreAJourConditionsArret(); mettreAJourCompteurs(); }); });
[scoreLimiteInput, scoreRelatifInput, nbManchesTotalInput, nbManchesRestantesInput].forEach(input => { input.addEventListener('change', () => { mettreAJourConditionsArret(); mettreAJourCompteurs(); }); });
nomJoueurInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { ajouterBouton.click(); } });
revealEcran.addEventListener('click', (e) => { if (e.target.closest('#skip-all-btn') || e.target.closest('#reveal-content')) { return; } if (currentStepSkipper) { currentStepSkipper(); } });
skipAllBtn.addEventListener('click', () => { sequenceForceStop = true; if (currentStepSkipper) { currentStepSkipper(); } revealEcran.classList.add('cache'); showPage('page-podium'); construirePodiumFinal(); });
retourAccueilBtn.addEventListener('click', () => { showPage('page-ongoing-games'); const graphContainer = document.querySelector('.graphique-container'); const graphOriginalParent = document.getElementById('page-score').querySelector('.score-gauche'); const inputTourDiv = document.getElementById('page-score').querySelector('.input-tour'); if (graphContainer && graphOriginalParent && inputTourDiv) { graphOriginalParent.insertBefore(graphContainer, inputTourDiv); if (monGraphique) { monGraphique.destroy(); monGraphique = null; } } });
// --- Stats & Amis Helpers ---
function mettreAJourDatalistJeux() { datalistJeux.innerHTML = ''; categoriesJeuxConnues.forEach(nomJeu => { const option = document.createElement('option'); option.value = nomJeu; datalistJeux.appendChild(option); }); }
async function chargerCategoriesConnues() { if (!currentUser) return; const userRef = db.collection('utilisateurs').doc(currentUser.uid); try { const querySnapshot = await userRef.collection('historique').get(); const nomsJeux = new Set(); querySnapshot.forEach(doc => { const nomJeu = doc.data().nomJeu; if (nomJeu) { nomsJeux.add(nomJeu); } }); categoriesJeuxConnues = [...nomsJeux].sort(); mettreAJourDatalistJeux(); } catch (err) { console.error("Erreur chargement catégories: ", err); } }
function afficherSuggestionsJoueurs() { listeSuggestionsJoueurs.innerHTML = ''; if (joueursRecents.length === 0) { suggestionsJoueursDiv.classList.add('cache'); return; } suggestionsJoueursDiv.classList.remove('cache'); joueursRecents.sort((a,b) => a.nom.localeCompare(b.nom)).forEach(joueur => { const tag = document.createElement('div'); tag.className = 'joueur-suggestion-tag'; tag.dataset.nom = joueur.nom; tag.dataset.couleur = joueur.couleur; tag.innerHTML = ` <span class="joueur-couleur-swatch" style="background-color: ${joueur.couleur};"></span> <span>${joueur.nom}</span> `; listeSuggestionsJoueurs.appendChild(tag); }); }
async function chargerJoueursRecents() { if (!currentUser) return; const userRef = db.collection('utilisateurs').doc(currentUser.uid); try { const querySnapshot = await userRef.collection('joueursRecents').get(); joueursRecents = []; querySnapshot.forEach(doc => { joueursRecents.push(doc.data()); }); afficherSuggestionsJoueurs(); } catch (err) { console.error("Erreur chargement joueurs récents: ", err); } }
listeSuggestionsJoueurs.addEventListener('click', (e) => { const tag = e.target.closest('.joueur-suggestion-tag'); if (tag) { const nom = tag.dataset.nom; const couleur = tag.dataset.couleur; nomJoueurInput.value = nom; couleurJoueurInput.value = couleur; } });
// ... Fonctions Amis (ajouterAmi, chargerAmis, supprimerAmi, sauvegarderAmi) ...
// (Elles sont définies plus haut dans le bloc principal, je ne les répète pas ici pour éviter les erreurs de syntaxe, mais elles sont essentielles)
function supprimerAmi(uid) { if (!currentUser) return; if(confirm("Supprimer cet ami ?")) { db.collection('utilisateurs').doc(currentUser.uid).collection('amis').doc(uid).delete().then(() => chargerAmis()); } }
async function sauvegarderAmi(uid, nouveauSurnom, nouvelleCouleur, ancienNom) { if (!currentUser) return; await db.collection('utilisateurs').doc(currentUser.uid).collection('amis').doc(uid).update({ surnom: nouveauSurnom, couleur: nouvelleCouleur }); const historyRef = db.collection('utilisateurs').doc(currentUser.uid).collection('historique'); const snapshot = await historyRef.get(); snapshot.forEach(doc => { let data = doc.data(); let modified = false; if (data.joueursComplets) { data.joueursComplets = data.joueursComplets.map(j => { if (j.uid === uid || (!j.uid && j.nom === ancienNom)) { j.nom = nouveauSurnom; j.couleur = nouvelleCouleur; if (!j.uid) j.uid = uid; modified = true; } return j; }); } if (data.classement) { data.classement = data.classement.map(j => { if (j.uid === uid || (!j.uid && j.nom === ancienNom)) { j.nom = nouveauSurnom; j.couleur = nouvelleCouleur; if (!j.uid) j.uid = uid; modified = true; } return j; }); } if (modified) { historyRef.doc(doc.id).update({ joueursComplets: data.joueursComplets, classement: data.classement }); } }); chargerAmis(); chargerHistoriqueParties(); }
function chargerAmis() { if (!currentUser) return; db.collection('utilisateurs').doc(currentUser.uid).collection('amis').get().then(snapshot => { mesAmis = []; friendsListContainer.innerHTML = ""; selectAmiAjout.innerHTML = '<option value="">-- Choisir un ami --</option>'; if (snapshot.empty) { friendsListContainer.innerHTML = "<p>Pas d'amis.</p>"; return; } snapshot.forEach(doc => { const ami = doc.data(); mesAmis.push(ami); const pseudo = ami.surnom || ami.email; const couleur = ami.couleur || "#CCCCCC"; const div = document.createElement('div'); div.className = 'friend-item'; div.innerHTML = ` <div class="friend-view"> <div class="friend-info"> <span class="friend-color-swatch" style="background-color: ${couleur};"></span> <span>${pseudo}</span> <span class="friend-email">(${ami.email})</span> </div> <div class="friend-actions"> <button class="btn-icon btn-edit-friend"><i class="fa-solid fa-pencil"></i></button> <button class="btn-icon btn-delete-friend"><i class="fa-solid fa-trash"></i></button> </div> </div> <div class="friend-edit-form"> <input type="text" class="edit-surnom" value="${pseudo}"> <input type="color" class="edit-couleur" value="${couleur}"> <button class="btn-save-friend"><i class="fa-solid fa-check"></i></button> <button class="btn-cancel-friend"><i class="fa-solid fa-times"></i></button> </div> `; friendsListContainer.appendChild(div); const viewDiv = div.querySelector('.friend-view'); const editDiv = div.querySelector('.friend-edit-form'); viewDiv.querySelector('.btn-edit-friend').onclick = () => { viewDiv.style.display = 'none'; editDiv.style.display = 'flex'; }; viewDiv.querySelector('.btn-delete-friend').onclick = () => supprimerAmi(ami.uid); editDiv.querySelector('.btn-cancel-friend').onclick = () => { editDiv.style.display = 'none'; viewDiv.style.display = 'flex'; }; editDiv.querySelector('.btn-save-friend').onclick = () => { sauvegarderAmi(ami.uid, editDiv.querySelector('.edit-surnom').value, editDiv.querySelector('.edit-couleur').value, pseudo); }; const opt = document.createElement('option'); opt.value = ami.uid; opt.text = pseudo; opt.dataset.couleur = couleur; selectAmiAjout.appendChild(opt); }); }); }
// ... Charger Historique (déjà inclus plus haut dans le bloc) ...
async function chargerHistoriqueParties() { if (!currentUser) return; const userRef = db.collection('utilisateurs').doc(currentUser.uid); historyGridJeux.innerHTML = "Chargement..."; try { const querySnapshot = await userRef.collection('historique').orderBy('date', 'desc').get(); allHistoryData = []; querySnapshot.forEach(doc => { let data = doc.data(); data.id = doc.id; allHistoryData.push(data); }); if (allHistoryData.length === 0) { historyGridJeux.innerHTML = "<p>Aucun historique.</p>"; return; } const partiesParJeu = {}; allHistoryData.forEach(partie => { const nomJeu = partie.nomJeu || "Parties"; partiesParJeu[nomJeu] = (partiesParJeu[nomJeu] || 0) + 1; }); historyGridJeux.innerHTML = ""; Object.keys(partiesParJeu).sort().forEach(nomJeu => { const nb = partiesParJeu[nomJeu]; const div = document.createElement('div'); div.className = 'history-game-square'; div.dataset.nomJeu = nomJeu; div.innerHTML = `${nomJeu}<span>${nb} partie${nb>1?'s':''}</span>`; historyGridJeux.appendChild(div); }); afficherStatsGlobales(); } catch (err) { console.error(err); historyGridJeux.innerHTML = "<p>Erreur.</p>"; } }
function afficherStatsGlobales() { if (allHistoryData.length === 0) return; const partiesParJeu = {}; allHistoryData.forEach(p => { const n = p.nomJeu || "Parties"; partiesParJeu[n] = (partiesParJeu[n]||0)+1; }); const freqTries = Object.entries(partiesParJeu).sort((a,b)=>b[1]-a[1]).slice(0,3); statsJeuxFrequenceListe.innerHTML = freqTries.map(([n,c]) => `<li>${n} <span>(${c})</span></li>`).join(''); const compteJoueurs = {}; allHistoryData.forEach(p => { (p.joueursComplets || p.classement).forEach(j => { compteJoueurs[j.nom] = (compteJoueurs[j.nom]||0)+1; }); }); const joueursTries = Object.entries(compteJoueurs).sort((a,b)=>b[1]-a[1]).slice(0,3); statsJoueursPodiumListe.innerHTML = joueursTries.map(([n,c]) => `<li>${n} <span>(${c})</span></li>`).join(''); const statsPerf = {}; allHistoryData.forEach(partie => { const nom = partie.nomJeu || "Parties"; const totalJ = partie.classement.length; if(totalJ <= 1) return; if(!statsPerf[nom]) statsPerf[nom] = { sumPct: 0, count: 0 }; const moi = partie.classement.find(j => j.uid === currentUser.uid); if(moi) { const pct = (totalJ - moi.rang) / (totalJ - 1); statsPerf[nom].sumPct += pct; statsPerf[nom].count++; } }); const perfTries = Object.entries(statsPerf).map(([n, d]) => ({ nom: n, avg: (d.count>0 ? (d.sumPct/d.count)*100 : 0) })).filter(x => x.avg > 0).sort((a,b) => b.avg - a.avg).slice(0,3); statsTopJeuxListe.innerHTML = perfTries.map(j => `<li>${j.nom} <span>(${j.avg.toFixed(0)}%)</span></li>`).join(''); }
function afficherDetailsHistoriqueJeu(nomJeu) { historyDetailsTitle.textContent = `Historique : ${nomJeu}`; listeHistoriquePartiesDetails.innerHTML = ''; joueursSurGraphique = []; mettreAJourTagsGraphique(); const parties = allHistoryData.filter(p => (p.nomJeu||"Parties") === nomJeu).sort((a,b) => new Date(b.date)-new Date(a.date)); const joueursSet = new Set(); parties.forEach(p => p.classement.forEach(j => joueursSet.add(j.nom))); historyPlayerSelect.innerHTML = ''; joueursSet.forEach(nom => { const opt = document.createElement('option'); opt.value = nom; opt.text = nom; historyPlayerSelect.appendChild(opt); }); parties.forEach(p => { const d = new Date(p.date).toLocaleDateString(); const podium = p.classement.slice(0,3).map(j => `${j.rang}. ${j.nom} (${j.scoreTotal})`).join('  '); const div = document.createElement('div'); div.className = 'partie-historique'; div.innerHTML = `<div class="header-info"><span class="time-date">${d}</span><div class="action-buttons"><button class="voir-hist-btn" data-id="${p.id}">Voir</button><button class="supprimer-hist-btn" data-id="${p.id}">&times;</button></div></div><div class="podium-mini">${podium}</div>`; listeHistoriquePartiesDetails.appendChild(div); }); showPage('page-history-details'); }
function mettreAJourTagsGraphique() { graphPlayersList.innerHTML = ''; joueursSurGraphique.forEach(nom => { const tag = document.createElement('span'); tag.className = 'graph-player-tag'; tag.innerHTML = `${nom} <button class="bouton-retirer">&times;</button>`; tag.querySelector('button').onclick = (e) => { e.stopPropagation(); joueursSurGraphique = joueursSurGraphique.filter(j => j !== nom); mettreAJourTagsGraphique(); const nomJeu = historyDetailsTitle.textContent.replace('Historique : ', ''); const parties = allHistoryData.filter(p => (p.nomJeu||"Parties") === nomJeu).sort((a,b)=>new Date(a.date)-new Date(b.date)); redessinerGraphiquePosition(parties); }; graphPlayersList.appendChild(tag); }); }
function redessinerGraphiquePosition(parties) { if(monGraphiquePosition) monGraphiquePosition.destroy(); if(joueursSurGraphique.length === 0) return; const labels = parties.map((p,i) => `P${i+1}`); const datasets = joueursSurGraphique.map((nom, i) => { const data = parties.map(p => { const j = p.classement.find(x => x.nom === nom); if(!j) return null; const total = p.classement.length; return total > 1 ? ((total - j.rang)/(total-1))*100 : 100; }); return { label: nom, data, borderColor: COULEURS_GRAPH[i%COULEURS_GRAPH.length], fill: false, spanGaps: true }; }); monGraphiquePosition = new Chart(canvasGraphiquePosition, { type: 'line', data: { labels, datasets }, options: { scales: { y: { min: 0, max: 100, ticks: { callback: v => v+'%' } } } } }); }
addPlayerToGraphBtn.addEventListener('click', () => { const nom = historyPlayerSelect.value; if(nom && !joueursSurGraphique.includes(nom)) { joueursSurGraphique.push(nom); mettreAJourTagsGraphique(); const nomJeu = historyDetailsTitle.textContent.replace('Historique : ', ''); const parties = allHistoryData.filter(p => (p.nomJeu||"Parties") === nomJeu).sort((a,b)=>new Date(a.date)-new Date(b.date)); redessinerGraphiquePosition(parties); } });
historyGridJeux.addEventListener('click', (e) => { const square = e.target.closest('.history-game-square'); if (square) afficherDetailsHistoriqueJeu(square.dataset.nomJeu); });
historyBackBtn.addEventListener('click', () => { showPage('page-history-grid'); joueursSurGraphique = []; mettreAJourTagsGraphique(); if(monGraphiquePosition) { monGraphiquePosition.destroy(); monGraphiquePosition=null; } });
listeHistoriquePartiesDetails.addEventListener('click', async (e) => { const target = e.target; const id = target.dataset.id; if (!id || !currentUser) return; if (target.classList.contains('supprimer-hist-btn')) { if (confirm("Supprimer ?")) { await db.collection('utilisateurs').doc(currentUser.uid).collection('historique').doc(id).delete(); await chargerHistoriqueParties(); const nomJeu = historyDetailsTitle.textContent.replace('Historique : ', ''); afficherDetailsHistoriqueJeu(nomJeu); } } if (target.classList.contains('voir-hist-btn')) { const partieData = allHistoryData.find(p => p.id === id); if (partieData) { classementFinal = partieData.classement; joueurs = partieData.joueursComplets; lowScoreWins = partieData.lowScoreWins; mancheActuelle = partieData.manches; showPage('page-podium'); construirePodiumFinal(); recreerGraphiqueFinal(); } } });

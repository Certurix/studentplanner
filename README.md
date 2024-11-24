# StudentPlanner
Projet de mise en application d'école full-stack.

# Ne pas push directement sur cette branche, créez ou modifiez une autre branche.
## Le(s) merge(s) seront effectués lorsque les tests auront été validés.

Un site qui vous aide dans votre parcours académique, un allié virtuel pour une organisation sans faille. 
Création d’emplois du temps personnalisés, intégration rendez-vous, cours et loisirs.
Une aide pour être mieux organisé.
Un site qui équilibre nos différents modes de vie.

L’idée : Créé une plateforme de plannings pour les étudiants.
Cette plateforme a pour but d’aider les étudiants dans leur organisation. En effet, sur notre plateforme, chaque utilisateur pourra créer trois plannings différents :
Un personnel, un professionnel (job étudiant/travail) et un collectif.
Des plannings qui contiendront les rendez-vous, les cours, les loisirs (sports, activités), etc. 

Pour l’interface du site, nous utiliserons des langages front tels que l’HTML, CSS. 
Pour l’expérience utilisateur et les fonctionnalités du site, du Javascript.
Pour le fonctionnement du site en back, nous songeons à utiliser du Python. 
Pour tout ce qui est base de données, nous nous pencherons pour l’instant sur du SQL.

## Démarrage backend

### Se déplacer dans le dossier du projet (studentplanner)
 ```bash
 cd studentplanner
```
 OU
 ```bash
 cd ../
 ```

### Activer la venv
 ```bash
venv\Scripts\activate
 ```

### Se déplacer dans le dossier backend
 ```bash
cd backend
 ```

### Vérifier que fastapi est bel et bien installé
 ```bash
pip check
 ```
OU (checker manuellement)
 ```bash
 pip list
 ```

### Commande à utiliser
 ```bash
fastapi dev backend/app
```
## Démarrage frontend
### Installer NodeJS s'il n'est pas déjà installé
https://nodejs.org

### Pour vérifier si NodeJS est installé
```bash
node -v
```

### Se déplacer dans le dossier frontend
```bash
cd frontend
 ```

### Installer les paquets
```bash
npm i
 ```

### Commande à utiliser
```bash
npm run start
 ```
Cela ouvrira automatiquement une page web de l'app

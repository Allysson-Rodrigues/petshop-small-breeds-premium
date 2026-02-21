📖 Reference Guide / Guia de Referência
This guide contains the essential commands for managing this template. Este guia contém os comandos essenciais para gerenciar este template.

🐙 GitHub CLI (gh)
Commands to manage your repository from the terminal. Comandos para gerenciar seu repositório pelo terminal.

Watch Actions / Monitorar Automação: gh run watch.

List Runs / Listar Execuções: gh run list.

Create Project / Criar Projeto via Template: gh repo create <name> --template Allysson-Rodrigues/node-express-template --public --clone

Add Topics / Adicionar Tags: gh repo edit --add-topic "nodejs,express,docker,backend"

🐳 Docker
Managing your containerized environment. Gerenciando seu ambiente em containers.

Build Image / Construir Imagem: docker build -t node-express-template ..

Run Container / Rodar Container: docker run -p 3000:3000 node-express-template.

List Containers / Listar Rodando: docker ps.

🛠️ Project Scripts (npm)
Internal automation for code quality. Automação interna para qualidade de código.

Development / Modo Dev: npm run dev.

Check Lint / Verificar Lint: npm run lint.

Fix Lint / Corrigir Automaticamente: npm run lint:fix.

Format Code / Formatar Código: npm run format.

📂 Git Workflow
Standardized commit and push flow. Fluxo padronizado de commit e push.

Stage Changes / Preparar Arquivos: git add ..

Commit / Criar Registro: git commit -m "type: description".

Push / Enviar para GitHub: git push origin main.

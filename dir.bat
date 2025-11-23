@echo off
echo ===========================================
echo    Creating FULL cEd-GH folder structure...
echo ===========================================

REM ROOT
mkdir "E:\cEd-GH"

REM -----------------------------------------
REM BACKEND ROOT
REM -----------------------------------------
mkdir "E:\cEd-GH\backend"
mkdir "E:\cEd-GH\backend\config"
mkdir "E:\cEd-GH\backend\secrets"
mkdir "E:\cEd-GH\backend\logs"
mkdir "E:\cEd-GH\backend\src"
mkdir "E:\cEd-GH\backend\src\routes"
mkdir "E:\cEd-GH\backend\src\controllers"
mkdir "E:\cEd-GH\backend\src\services"
mkdir "E:\cEd-GH\backend\src\webhooks"
mkdir "E:\cEd-GH\backend\src\utils"
mkdir "E:\cEd-GH\backend\tests"

REM -----------------------------------------
REM LEAF FILES — EMPTY PLACEHOLDERS
REM -----------------------------------------

REM Backend root files
type nul > "E:\cEd-GH\backend\index.js"
type nul > "E:\cEd-GH\backend\package.json"
type nul > "E:\cEd-GH\backend\.env"
type nul > "E:\cEd-GH\backend\README.md"
type nul > "E:\cEd-GH\backend\.gitignore"

REM Config files
type nul > "E:\cEd-GH\backend\config\github.js"
type nul > "E:\cEd-GH\backend\config\server.js"
type nul > "E:\cEd-GH\backend\config\routes.js"

REM Controllers
type nul > "E:\cEd-GH\backend\src\controllers\authController.js"
type nul > "E:\cEd-GH\backend\src\controllers\repoController.js"
type nul > "E:\cEd-GH\backend\src\controllers\webhookController.js"
type nul > "E:\cEd-GH\backend\src\controllers\userController.js"

REM Routes
type nul > "E:\cEd-GH\backend\src\routes\authRoutes.js"
type nul > "E:\cEd-GH\backend\src\routes\repoRoutes.js"
type nul > "E:\cEd-GH\backend\src\routes\webhookRoutes.js"
type nul > "E:\cEd-GH\backend\src\routes\userRoutes.js"

REM Services
type nul > "E:\cEd-GH\backend\src\services\githubAppService.js"
type nul > "E:\cEd-GH\backend\src\services\repoService.js"
type nul > "E:\cEd-GH\backend\src\services\jwtService.js"
type nul > "E:\cEd-GH\backend\src\services\userService.js"

REM Webhooks
type nul > "E:\cEd-GH\backend\src\webhooks\githubWebhookHandler.js"
type nul > "E:\cEd-GH\backend\src\webhooks\eventTypes.js"

REM Utils
type nul > "E:\cEd-GH\backend\src\utils\logger.js"
type nul > "E:\cEd-GH\backend\src\utils\verifySignature.js"
type nul > "E:\cEd-GH\backend\src\utils\httpResponse.js"
type nul > "E:\cEd-GH\backend\src\utils\errorHandler.js"

REM Tests
type nul > "E:\cEd-GH\backend\tests\auth.test.js"
type nul > "E:\cEd-GH\backend\tests\repo.test.js"

REM Secrets placeholder (private key goes here)
type nul > "E:\cEd-GH\backend\secrets\.keep"

REM Logs placeholder
type nul > "E:\cEd-GH\backend\logs\.keep"

REM -----------------------------------------
REM FRONTEND PLACEHOLDER STRUCTURE
REM -----------------------------------------
mkdir "E:\cEd-GH\frontend"
mkdir "E:\cEd-GH\frontend\src"
mkdir "E:\cEd-GH\frontend\public"
type nul > "E:\cEd-GH\frontend\package.json"
type nul > "E:\cEd-GH\frontend\README.md"
type nul > "E:\cEd-GH\frontend\src\index.js"
type nul > "E:\cEd-GH\frontend\public\index.html"

echo ===========================================
echo    ALL FILES AND FOLDERS CREATED!
echo    Open VS Code:  code E:\cEd-GH
echo    Tell me: "ready for backend setup"
echo ===========================================
pause

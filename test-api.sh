#!/bin/bash

# 🚀 Script de test pour l'API Club Fans
# Usage: ./test-api.sh [command]
# Commands: login, profile, create-creator, get-creator, all

# Configuration
BASE_URL="http://localhost:3000"
EMAIL="test@club.fans"
PASSWORD="testclub"
CREATOR_USERNAME="creatorX"
CREATOR_MONTHLY_PRICE=499

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Vérifier si l'application est en cours d'exécution
check_server() {
    print_info "Vérification de la disponibilité du serveur..."
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/" --connect-timeout 5)
    if [[ $response -eq 000 ]]; then
        print_error "Le serveur n'est pas accessible à $BASE_URL"
        print_info "Assurez-vous que l'application est démarrée avec: npm run start:dev"
        return 1
    fi
    print_success "Serveur accessible (Code: $response)"
    return 0
}

# Fonction pour tester le login
test_login() {
    print_header "1. Test de l'authentification (POST /auth/login)"
    print_info "Email: $EMAIL"
    print_info "Password: $PASSWORD"
    echo

    # Vérifier que le serveur est accessible
    if ! check_server; then
        return 1
    fi

    # Effectuer la requête de login
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

    # Séparer la réponse du code de statut de manière plus fiable
    http_code=$(echo "$response" | grep -o 'HTTPSTATUS:[0-9]*' | cut -d':' -f2)
    response_body=$(echo "$response" | sed 's/HTTPSTATUS:[0-9]*$//')

    print_info "Code de statut HTTP: $http_code"

    if [[ $http_code -eq 200 || $http_code -eq 201 ]]; then
        print_success "Login réussi!"

        # Afficher la réponse brute pour diagnostiquer
        print_info "Réponse brute: $response_body"

        # Formater la réponse JSON si possible
        if command -v jq &> /dev/null; then
            echo "$response_body" | jq .
            TOKEN=$(echo "$response_body" | jq -r '.token' 2>/dev/null)
        else
            echo "$response_body"
            # Extraire le token sans jq - méthode améliorée
            TOKEN=$(echo "$response_body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        fi

        print_info "Token extrait: '$TOKEN'"
        print_info "Longueur du token: ${#TOKEN}"

        if [[ $TOKEN != "null" && $TOKEN != "" && ${#TOKEN} -gt 10 ]]; then
            echo "$TOKEN" > .token
            print_success "Token sauvegardé dans .token"
            print_info "Token: ${TOKEN:0:20}..."
        else
            print_error "Impossible d'extraire le token de la réponse"
            print_error "Token reçu: '$TOKEN'"
            return 1
        fi
    else
        print_error "Échec du login (Code: $http_code)"
        echo "$response_body"
        return 1
    fi
    echo
}

# Fonction pour tester le profil
test_profile() {
    print_header "2. Test du profil utilisateur (GET /profile)"

    if [[ ! -f .token ]]; then
        print_error "Token non trouvé. Exécutez d'abord 'login'"
        return 1
    fi

    TOKEN=$(cat .token)
    print_info "Utilisation du token: ${TOKEN:0:20}..."

    response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/profile" \
        -H "Authorization: Bearer $TOKEN")

    # Séparer la réponse du code de statut
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -1)

    print_info "Code de statut HTTP: $http_code"

    if [[ $http_code -eq 200 ]]; then
        print_success "Récupération du profil réussie!"
        if command -v jq &> /dev/null; then
            echo "$response_body" | jq .
        else
            echo "$response_body"
        fi
    else
        print_error "Échec de la récupération du profil (Code: $http_code)"
        echo "$response_body"
        if [[ $http_code -eq 401 ]]; then
            print_info "Token peut-être expiré. Essayez de vous reconnecter avec 'login'"
        fi
        return 1
    fi
    echo
}

# Fonction pour créer un créateur
test_create_creator() {
    print_header "3. Test de création d'un créateur (POST /creators)"
    print_info "Username: $CREATOR_USERNAME"
    print_info "Monthly Price: $CREATOR_MONTHLY_PRICE centimes"

    if [[ ! -f .token ]]; then
        print_error "Token non trouvé. Exécutez d'abord 'login'"
        return 1
    fi

    TOKEN=$(cat .token)
    print_info "Utilisation du token: ${TOKEN:0:20}..."

    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$BASE_URL/creators" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d "{\"username\": \"$CREATOR_USERNAME\", \"monthlyPrice\": $CREATOR_MONTHLY_PRICE}")

    # Séparer la réponse du code de statut de manière plus fiable
    http_code=$(echo "$response" | grep -o 'HTTPSTATUS:[0-9]*' | cut -d':' -f2)
    response_body=$(echo "$response" | sed 's/HTTPSTATUS:[0-9]*$//')

    print_info "Code de statut HTTP: $http_code"

    if [[ $http_code -eq 200 || $http_code -eq 201 ]]; then
        print_success "Création du créateur réussie!"
        if command -v jq &> /dev/null; then
            echo "$response_body" | jq .
        else
            echo "$response_body"
        fi
    elif [[ $http_code -eq 409 ]]; then
        print_info "Le créateur existe déjà (Code: $http_code)"
        echo "$response_body"
    else
        print_error "Échec de la création du créateur (Code: $http_code)"
        echo "$response_body"
        if [[ $http_code -eq 401 ]]; then
            print_info "Token peut-être expiré. Essayez de vous reconnecter avec 'login'"
        fi
        return 1
    fi
    echo
}

# Fonction pour récupérer un créateur
test_get_creator() {
    print_header "4. Test de récupération d'un créateur (GET /creators/:username)"
    print_info "Username: $CREATOR_USERNAME"

    if [[ ! -f .token ]]; then
        print_error "Token non trouvé. Exécutez d'abord 'login'"
        return 1
    fi

    TOKEN=$(cat .token)
    print_info "Utilisation du token: ${TOKEN:0:20}..."

    response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/creators/$CREATOR_USERNAME" \
        -H "Authorization: Bearer $TOKEN")

    # Séparer la réponse du code de statut
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -1)

    print_info "Code de statut HTTP: $http_code"

    if [[ $http_code -eq 200 ]]; then
        print_success "Récupération du créateur réussie!"
        if command -v jq &> /dev/null; then
            echo "$response_body" | jq .
        else
            echo "$response_body"
        fi
    elif [[ $http_code -eq 404 ]]; then
        print_error "Créateur non trouvé (Code: $http_code)"
        print_info "Créez d'abord le créateur avec 'create-creator'"
        echo "$response_body"
        return 1
    else
        print_error "Échec de la récupération du créateur (Code: $http_code)"
        echo "$response_body"
        if [[ $http_code -eq 401 ]]; then
            print_info "Token peut-être expiré. Essayez de vous reconnecter avec 'login'"
        fi
        return 1
    fi
    echo
}

# Fonction pour afficher l'aide
show_help() {
    print_header "🚀 Script de test pour l'API Club Fans"
    echo "Usage: ./test-api.sh [command]"
    echo
    echo "Commands disponibles:"
    echo "  login         - Tester l'authentification"
    echo "  profile       - Tester la récupération du profil"
    echo "  create-creator - Tester la création d'un créateur"
    echo "  get-creator   - Tester la récupération d'un créateur"
    echo "  all           - Exécuter tous les tests"
    echo "  help          - Afficher cette aide"
    echo
    echo "Configuration:"
    echo "  Base URL: $BASE_URL"
    echo "  Email: $EMAIL"
    echo "  Password: $PASSWORD"
    echo "  Creator Username: $CREATOR_USERNAME"
    echo "  Creator Price: $CREATOR_MONTHLY_PRICE centimes"
    echo
    print_info "Le token est automatiquement sauvegardé dans .token après le login"
}

# Vérifier que jq est installé (optionnel, pour un meilleur formatage JSON)
check_dependencies() {
    if ! command -v jq &> /dev/null; then
        print_info "jq n'est pas installé. Les réponses JSON ne seront pas formatées."
        print_info "Pour installer jq: brew install jq"
    fi
}

# Script principal
main() {
    check_dependencies

    case "$1" in
        "login")
            test_login
            ;;
        "profile")
            test_profile
            ;;
        "create-creator")
            test_create_creator
            ;;
        "get-creator")
            test_get_creator
            ;;
        "all")
            test_login && test_profile && test_create_creator && test_get_creator
            print_header "🎉 Tous les tests terminés!"
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        "")
            show_help
            ;;
        *)
            print_error "Commande inconnue: $1"
            show_help
            exit 1
            ;;
    esac
}

# Exécuter le script principal
main "$@"

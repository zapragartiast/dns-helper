#!/bin/sh

run() {
  echo "Running: $@"
  "$@"
  if [ $? -ne 0 ]; then
    echo "[x] Error: Failed to run command: $@"
    exit 1
  else
    echo "[!] Success: $@"
  fi
}

progress_bar() {
  local duration=${1}
  already_done() { for ((done=0; done<$elapsed; done++)); do printf "▇"; done }
  remaining() { for ((remain=$elapsed; remain<$duration; remain++)); do printf " "; done }
  percentage() { printf "| %s%%" $(( (($elapsed)*100)/($duration)*100/100 )); }
  for ((elapsed=1; elapsed<=$duration; elapsed++))
  do
    already_done; remaining; percentage
    sleep 0.1
    printf "\r"
  done
  printf "\n"
}

command_exists() {
  command -v "$1" &> /dev/null
}

echo "[i] Installation started..."

echo "[i] Checking Homebrew installation..."
if ! command_exists brew; then
  echo "[x] Error: Homebrew is not installed. Please install Homebrew first."
  exit 1
fi
echo "[i] Success: Homebrew is installed."
progress_bar 10

echo "[i] Checking Node.js installation..."
if ! command_exists node; then
  echo "[x] Error: Node.js is not installed. Please install Node.js first."
  exit 1
fi
if ! command_exists npm; then
  echo "[x] Error: npm is not installed. Please install npm first."
  exit 1
fi
echo "[i] Success: Node.js is installed."
progress_bar 10

echo "[i] Checking curl installation..."
if ! command_exists curl; then
  echo "[x] Error: curl is not installed. Please install curl first."
  exit 1
fi
echo "[i] Success: curl is installed."
progress_bar 10

echo "[i] Checking Git installation..."
if ! command_exists git; then
  echo "[x] Error: Git is not installed. Please install Git first."
  exit 1
fi
echo "[i] Success: Git is installed."
progress_bar 10

HOME_DIR="$HOME/.jamal"
if [ -d "$HOME_DIR" ]; then
  echo "[x] Error: Directory $HOME_DIR already exists. Exiting installer."
  exit 1
fi

echo "[i] Creating directory $HOME_DIR..."
run mkdir -p "$HOME_DIR"
progress_bar 10

echo "[i] Changing directory to $HOME_DIR..."
run cd "$HOME_DIR"
progress_bar 10

echo "[i] Cloning repository..."
run git clone https://github.com/marie-onette/dns-helper.git .
progress_bar 20

echo "[i] Installing NodeJS modules..."
run npm i
progress_bar 20

ZSHRC="$HOME/.zshrc"
ALIAS_COMMAND="alias ss='node $HOME_DIR/jamal.js \"\$@\"'"
if ! grep -qF "$ALIAS_COMMAND" "$ZSHRC"; then
  echo "$ALIAS_COMMAND" >> "$ZSHRC"
  if [ $? -ne 0 ]; then
    echo "[x] Error: Failed to add alias to $ZSHRC"
    exit 1
  else
    echo "[i] Success: Alias added to $ZSHRC"
  fi
fi
progress_bar 10

# Source .zshrc
echo "[i] Please run 'source ~/.zshrc' in your zsh shell to complete the installation."
progress_bar 10

echo "[i] Installation finished."

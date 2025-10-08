{
  description = "Nix build environment for TypeScript projects";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = inputs: let
    supportedSystems = ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"];
    forEachSupportedSystem = f:
      inputs.nixpkgs.lib.genAttrs supportedSystems (system:
        f {
          pkgs = import inputs.nixpkgs {
            inherit system;
            config.allowUnfree = true;
          };
        });
  in {
    devShells = forEachSupportedSystem ({pkgs}: {
      default = pkgs.mkShell {
        packages = with pkgs; [
          # Development Tools
          corepack
          docker
          git
          git-lfs
          lazygit
          lazydocker
          nodejs

          # Code Editors
          neovim
          vscode

          # Shell Tools
          act
          atuin
          bat
          cargo
          curl
          eza
          fzf
          gawk
          hyperfine
          jq
          mkcert
          openssh
          openvpn
          tealdeer
          wget
          zq

          # Shell Dependencies
          alejandra
          direnv
          gum
          macchina
          which
        ];
        shellHook = ''
          clear
          macchina

          echo "Setting up environment variables..."
          export EDITOR=$(which nvim)
          export VISUAL=$(which code)

          echo "Setting up shell aliases..."
          alias ..="cd .."
          alias cat=bat
          alias ls="eza -lh --group-directories-first --icons=auto"
          alias ll="ls -la"
          alias vim=nvim

          if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
          echo "Setting up Git..."
          git config alias.co checkout
          git config alias.br branch
          git config alias.ci commit
          git config alias.st status
          git config alias.amend "commit --amend -m"
          git config alias.unstage "restore --staged"
          git config help.autocorrect 50
          else
          gum log -sl warn "Not inside a Git repository, skipping config setup"
          fi

          if [ -f "package.json" ]; then
          corepack install
          pnpm install --frozen-lockfile

          echo -e "\nCurrent Project: $(jq -r '.name' package.json)"
          else
          gum log -sl warn "No package.json found, skipping installation step"
          fi
        '';
      };
    });
  };
}

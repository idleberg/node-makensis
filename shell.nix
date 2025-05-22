{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  packages = with pkgs; [ corepack deno git nodejs nsis openssh ];

  shellHook = ''
    corepack enable
    corepack up
  '';
}

# Simple wrappers for Flatpak workflow
MANIFEST := io.github.tduarte.Settings.json
APPID := io.github.tduarte.Settings
BUILDDIR := builddir
BUILDER := org.flatpak.Builder

.PHONY: lint build run clean help

help:
	@echo "make lint   - Lint Flatpak manifest"
	@echo "make build  - Build and install via Flatpak Builder"
	@echo "make run    - Run the app"
	@echo "make clean  - Remove build artifacts"

lint:
	flatpak run --command=flatpak-builder-lint $(BUILDER) manifest $(MANIFEST)

build:
	flatpak run --command=flathub-build $(BUILDER) --install $(MANIFEST)

run:
	flatpak run $(APPID)

clean:
	rm -rf $(BUILDDIR)
	rm -rf .flatpak-builder
	rm -rf .flatpak
	rm -rf repo

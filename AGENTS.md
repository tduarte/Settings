# Repository Guidelines

## Project Structure & Module Organization
- `src/`: GJS code and UI templates (`main.js`, `window.js`, `.ui`). Resources load from `resource:///io/github/tduarte/Settings/...`.
- `data/`: App metadata (`.desktop`, AppStream), GSettings schema (`.gschema.xml`), D-Bus service, and icons under `data/icons/`.
- `po/`: Translations (update when strings change).
- Build system: Meson (invoked by Flatpak builder). UI uses Libadwaita (`Adw`) and GTK 4.

## Build, Test, and Development Commands
- Lint manifest: `flatpak run --command=flatpak-builder-lint org.flatpak.Builder manifest io.github.tduarte.Settings.json`
  - Enforces Flatpak manifest best practices.
- Build and install:
  - `flatpak run --command=flathub-build org.flatpak.Builder --install io.github.tduarte.Settings.json`
  - Uses the Flathub helper to build in a clean sandbox and install locally.
- Run the app: `flatpak run io.github.tduarte.Settings`
- Optional host build (for quick checks): run Meson locally, but prefer Flatpak for parity with Flathub.

Makefile shortcuts:
- `make lint` – lint manifest
- `make build` – build and install via `flathub-build`
- `make run` – launch the app
- `make clean` – remove `builddir/`

## Coding Style & Naming Conventions
- Language: GJS (ES modules). Use `gi://` imports and `GObject.registerClass`.
- Indentation: 4 spaces; include semicolons; prefer single quotes for strings.
- Classes: `PascalCase` (e.g., `SettingsApplication`, `SettingsWindow`).
- Files: `kebab-case.js` for modules; `.ui` templates in `src/` or `src/gtk/`.
- Resources: keep paths under `/io/github/tduarte/Settings`; update `.gresource.xml` when adding UI/assets.

## Testing Guidelines
- `meson test` runs during the Flatpak build; ensure validators pass (desktop, AppStream, GSettings schema).
- No JS unit tests yet. If adding, wire them into Meson so they execute via Flatpak Builder.
- Keep tests fast and deterministic; cover startup and window creation paths.

## Commit & Pull Request Guidelines
- Commits: clear, scoped messages. Prefer Conventional Commits (`feat:`, `fix:`, `build:`, `docs:`, `refactor:`).
- PRs: include a summary, linked issues, and screenshots/gifs for UI changes. Note schema or resource changes explicitly.
- Keep diffs minimal; update translations (`po/`) when user-facing strings change.

## Distribution & Notes
- Target: Flathub (use GNOME `org.gnome.Platform`/`Sdk` per manifest).
- Toolkit: Libadwaita for UI patterns and widgets.
- Before submitting, lint the manifest and verify `flatpak run io.github.tduarte.Settings` works as expected.

## Reference Docs
- Libadwaita 1.7: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.7/index.html

Key Libadwaita Widgets
- AdwApplicationWindow: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.7/classes/AdwApplicationWindow.html
- AdwHeaderBar: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.7/classes/AdwHeaderBar.html
- AdwOverlaySplitView: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.7/classes/AdwOverlaySplitView.html
- AdwNavigationSplitView: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.7/classes/AdwNavigationSplitView.html
- AdwViewStack: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.7/classes/AdwViewStack.html
- AdwViewStackPage: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.7/classes/AdwViewStackPage.html
- AdwViewSwitcherTitle: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.7/classes/AdwViewSwitcherTitle.html
- AdwPreferencesPage: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.7/classes/AdwPreferencesPage.html
- AdwPreferencesGroup: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.7/classes/AdwPreferencesGroup.html
- AdwActionRow: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.7/classes/AdwActionRow.html
- AdwComboRow: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.7/classes/AdwComboRow.html
- AdwSwitchRow: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.7/classes/AdwSwitchRow.html
- AdwAboutDialog: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.7/classes/AdwAboutDialog.html
- AdwStyleManager: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.7/classes/AdwStyleManager.html

GTK 4 References (commonly used)
- GtkListBox: https://docs.gtk.org/gtk4/class.ListBox.html
- GtkListBoxRow: https://docs.gtk.org/gtk4/class.ListBoxRow.html
- GtkScrolledWindow: https://docs.gtk.org/gtk4/class.ScrolledWindow.html
- GtkSwitch: https://docs.gtk.org/gtk4/class.Switch.html
- GtkStringList: https://docs.gtk.org/gtk4/class.StringList.html

## Widget Cheat Sheet
- AdwOverlaySplitView:
  - Hierarchy: GObject → GtkWidget → AdwOverlaySplitView
  - Example (UI): `<object class="AdwOverlaySplitView"><property name="sidebar">…</property><property name="content">…</property></object>`
- AdwViewStack + Pages:
  - Hierarchy: GObject → GtkWidget → AdwViewStack; GObject → AdwViewStackPage
  - Example (JS): `stack.add_titled(page, 'general', 'General')`; then `stack.set_visible_child_name('general')`.
- AdwHeaderBar + AdwViewSwitcherTitle:
  - Hierarchy: GtkWidget → AdwHeaderBar; GtkWidget → AdwViewSwitcherTitle
  - Example (UI): `<object class="AdwViewSwitcherTitle"><property name="stack">stack</property></object>` inside `AdwHeaderBar`.
- AdwPreferencesPage/Group/Rows:
  - Hierarchy: GtkWidget → AdwPreferencesPage; GtkWidget → AdwPreferencesGroup; GtkListBoxRow → AdwPreferencesRow → AdwActionRow/AdwComboRow/AdwSwitchRow
  - Example (UI):
    `<object class="AdwPreferencesPage"><child><object class="AdwPreferencesGroup"><child><object class="AdwActionRow"><child type="suffix"><object class="GtkSwitch"/></child></object></child></object></child></object>`
- AdwStyleManager:
  - Hierarchy: GObject → AdwStyleManager
  - Example (JS): `Adw.StyleManager.get_default().set_color_scheme(Adw.ColorScheme.FORCE_DARK)`.

Note: For full inheritance trees and API details, see each widget’s docs linked above (Hierarchy section).

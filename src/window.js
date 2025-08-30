/* window.js
 *
 * Copyright 2025 Unknown
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk?version=4.0';
import Adw from 'gi://Adw?version=1';
import Gio from 'gi://Gio';

export const SettingsWindow = GObject.registerClass({
    GTypeName: 'SettingsWindow',
    Template: 'resource:///io/github/tduarte/Settings/window.ui',
    InternalChildren: ['stack', 'sidebar_list', 'split_view'],
}, class SettingsWindow extends Adw.ApplicationWindow {
    constructor(application) {
        super({ application });

        this._settings = new Gio.Settings({ schema_id: 'io.github.tduarte.Settings' });

        // Load and add pages to the stack
        this._addPage('/io/github/tduarte/Settings/pages/general.ui', 'general', 'General', builder => this._bindGeneral(builder));
        this._addPage('/io/github/tduarte/Settings/pages/appearance.ui', 'appearance', 'Appearance', builder => this._bindAppearance(builder));
        this._addPage('/io/github/tduarte/Settings/pages/keyboard.ui', 'keyboard', 'Keyboard');
        this._addPage('/io/github/tduarte/Settings/pages/network.ui', 'network', 'Network', builder => this._bindNetwork(builder));
        this._addPage('/io/github/tduarte/Settings/pages/about.ui', 'about', 'About');

        // Populate the sidebar from stack pages
        this._populateSidebar();
        this._sidebar_list.connect('row-selected', (list, row) => {
            if (!row)
                return;
            this._stack.set_visible_child_name(row.get_name());
            // If collapsed, show content page
            if (this._split_view?.set_show_content)
                this._split_view.set_show_content(true);
        });
        // Select first row
        const first = this._sidebar_list.get_row_at_index(0);
        if (first) {
            this._sidebar_list.select_row(first);
            this._stack.set_visible_child_name(first.get_name());
            if (this._split_view?.set_show_content)
                this._split_view.set_show_content(true);
        }

        // Apply style on startup and watch for changes
        this._applyStyleFromSettings();
        this._settings.connect('changed::color-scheme', () => this._applyStyleFromSettings());
    }


    _addPage(resourcePath, name, title, binder) {
        const builder = Gtk.Builder.new_from_resource(resourcePath);
        const page = builder.get_object('root');
        if (!page)
            return;
        if (typeof this._stack.add_titled === 'function')
            this._stack.add_titled(page, name, title);
        else {
            // Fallback for older API: add via AdwViewStackPage wrapper if needed
            this._stack.add(page);
            // Try to set page name for child-name navigation
            if (typeof page.set_name === 'function')
                page.set_name(name);
        }
        if (typeof binder === 'function')
            binder(builder);
    }

    _populateSidebar() {
        // Clear existing rows using GTK4 child iteration
        for (let row = this._sidebar_list.get_first_child(); row;) {
            const next = row.get_next_sibling();
            this._sidebar_list.remove(row);
            row = next;
        }
        if (typeof this._stack.get_pages !== 'function')
            return;
        const pages = this._stack.get_pages();
        const n = pages.get_n_items();
        for (let i = 0; i < n; i++) {
            const page = pages.get_item(i);
            const title = page?.get_title?.() ?? '';
            const name = page?.get_name?.() ?? '';
            const row = new Gtk.ListBoxRow();
            row.set_name(name);
            const ar = new Adw.ActionRow({ title });
            ar.activatable = true;
            row.set_child(ar);
            this._sidebar_list.append(row);
        }
    }

    _bindGeneral(builder) {
        const launchRow = builder.get_object('launch_row');
        const notifRow = builder.get_object('notif_row');
        if (launchRow)
            this._settings.bind('launch-at-login', launchRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        if (notifRow)
            this._settings.bind('show-notifications', notifRow, 'active', Gio.SettingsBindFlags.DEFAULT);
    }

    _bindNetwork(builder) {
        const netRow = builder.get_object('network_row');
        if (netRow)
            this._settings.bind('enable-networking', netRow, 'active', Gio.SettingsBindFlags.DEFAULT);
    }

    _bindAppearance(builder) {
        const combo = builder.get_object('color_combo');
        if (!combo)
            return;
        const applyFromSettings = () => {
            const val = this._settings.get_string('color-scheme');
            const idx = ({ system: 0, light: 1, dark: 2 })[val] ?? 0;
            combo.set_selected(idx);
        };
        const applyToSettings = () => {
            const idx = combo.get_selected();
            const val = ['system', 'light', 'dark'][idx] ?? 'system';
            this._settings.set_string('color-scheme', val);
            this._applyStyleFromSettings();
        };
        applyFromSettings();
        combo.connect('notify::selected', applyToSettings);
    }

    _applyStyleFromSettings() {
        const val = this._settings.get_string('color-scheme');
        const sm = Adw.StyleManager.get_default();
        const map = {
            'system': Adw.ColorScheme.DEFAULT,
            'light': Adw.ColorScheme.FORCE_LIGHT,
            'dark': Adw.ColorScheme.FORCE_DARK,
        };
        sm.set_color_scheme(map[val] ?? Adw.ColorScheme.DEFAULT);
    }
});

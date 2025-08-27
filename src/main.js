/* main.js
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
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk?version=4.0';
import Adw from 'gi://Adw?version=1';

import { SettingsWindow } from './window.js';

pkg.initGettext();
pkg.initFormat();

export const SettingsApplication = GObject.registerClass(
    class SettingsApplication extends Adw.Application {
        constructor() {
            super({
                application_id: 'io.github.tduarte.Settings',
                flags: Gio.ApplicationFlags.DEFAULT_FLAGS,
                resource_base_path: '/io/github/tduarte/Settings'
            });

            const quit_action = new Gio.SimpleAction({name: 'quit'});
                quit_action.connect('activate', action => {
                this.quit();
            });
            this.add_action(quit_action);
            this.set_accels_for_action('app.quit', ['<primary>q']);

            const show_about_action = new Gio.SimpleAction({name: 'about'});
            show_about_action.connect('activate', action => {
                const aboutParams = {
                    application_name: 'settings',
                    application_icon: 'io.github.tduarte.Settings',
                    developer_name: 'Unknown',
                    version: '0.1.0',
                    developers: [
                        'Unknown'
                    ],
                    // Translators: Replace "translator-credits" with your name/username, and optionally an email or URL.
                    translator_credits: _("translator-credits"),
                    copyright: '© 2025 Unknown'
                };
                const aboutDialog = new Adw.AboutDialog(aboutParams);
                aboutDialog.present(this.active_window);
            });
            this.add_action(show_about_action);
        }

        vfunc_activate() {
            let {active_window} = this;

            if (!active_window)
                active_window = new SettingsWindow(this);

            active_window.present();
        }
    }
);

export function main(argv) {
    const application = new SettingsApplication();
    return application.runAsync(argv);
}

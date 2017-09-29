import Component from '@ember/component';
import layout from '../templates/components/koenig-card';
import {run} from '@ember/runloop';

export default Component.extend({
    layout,
    classNameBindings: ['isEditing'],

    isEditing: false,

    init() {
        this._super(...arguments);
        let card = this.get('card');
        if (card.newlyCreated) {
            run.next(() => {
                if (card.card.launchMode === 'edit') {
                    this.send('startEdit');
                    this.send('selectCard');
                } else {
                    this.send('selectCardHard');
                }
            });
            this.set('isNew', true);
            card.newlyCreated = false;
        }
    },

    didReceiveAttrs() {
        // we only want one card in "edit" mode at a time, if another card enters
        // edit mode, save this card and return to preview mode
        let editing = this.get('editedCard') === this.get('card');
        if (this.get('isEditing') && !editing) {
            this.send('stopEdit');
        }
        this.set('isEditing', editing);
    },

    didRender() {
        // add the classname to the wrapping card as generated by mobiledoc.
        // for some reason `this` on did render actually refers to the editor object and not the card object, after render it seems okay.
        run.schedule('afterRender', this,
            () => {
                let card = this.get('card');

                let {env: {name}} = card;

                // the mobiledoc generated container.
                let mobiledocCard = this.$().parents('.__mobiledoc-card');
                mobiledocCard.removeClass('__mobiledoc-card');
                mobiledocCard.addClass('kg-card');
                if (this.get('isNew')) {
                    mobiledocCard.hide();
                    mobiledocCard.fadeIn();
                }
                mobiledocCard.addClass(name ? `kg-${name}` : '');

                mobiledocCard.attr('tabindex', 4);
                mobiledocCard.click(() => {
                    if (!this.get('isEditing')) {
                        this.send('selectCardHard');
                    }
                });

            }
        );
    },

    actions: {
        save() {
            this.set('doSave', Date.now());
        },

        toggleState() {
            if (this.get('isEditing')) {
                this.send('stopEdit');
            } else {
                this.send('startEdit');
            }
        },

        selectCard() {
            this.sendAction('selectCard', this.card.id);
        },

        deselectCard() {
            this.sendAction('deselectCard', this.card.id);
            this.send('stopEdit');
            if (this.get('isNew')) {
                let mobiledocCard = this.$().parents('.kg-card');
                mobiledocCard.removeClass('new');
                this.set('isNew', false);
            }
        },

        selectCardHard() {
            this.sendAction('selectCardHard', this.card.id);
        },

        delete() {
            this.sendAction('deleteCard', this.card.id);
        },

        startEdit() {
            this.sendAction('edit', this.card.id);
        },

        stopEdit() {
            this.send('save');
            this.sendAction('stopEdit', this.card.id);
        }
    }
});

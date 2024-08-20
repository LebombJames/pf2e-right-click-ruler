const MODULE = "pf2e-right-click-waypoints";

Hooks.once("init", () => {
    if (!game.modules.get('lib-wrapper')?.active && game.user.isGM) {
        return ui.notifications.error("PF2e Right Click Waypoints requires the 'libWrapper' module. Please install and activate it.");
    }

    if (CONFIG.Canvas.rulerClass.name !== "RulerPF2e") {
        return ui.notifications.error("PF2e Right Click Waypoints has been disabled because RulerPF2e is not the default ruler!");
    }

    libWrapper.register(MODULE, "CONFIG.Canvas.rulerClass.prototype.onDragLeftCancel", function(wrapped, event = {})  {
        if (!this.dragMeasurement || !this.isMeasuring) return;

        this.saveWaypoint();
        // Prevent additional events from firing for dragged token
        if (this.isMeasuring) {
            event?.preventDefault();
        } else {
            canvas.mouseInteractionManager.cancel();
        }
    })

    game.keybindings.register(MODULE, "removeWaypoint", {
        name: "Remove Waypoint",
        hint: "Remove a waypoint while using drag measurement.",
        editable: [{ key: "Space", modifiers: [] }],
        onUp: () => {
            if (canvas.ready && canvas.controls.ruler.isMeasuring && game.pf2e.settings.dragMeasurement) {
                canvas.controls.ruler._removeWaypoint();
                return true;
            } else {
                return false;
            }
        },
    });
})

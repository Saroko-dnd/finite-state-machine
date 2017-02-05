class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config == undefined || config == null)
        {
            throw new Error();
        }

        this.CurrentConfig = config;
        this.CurrentState = config.initial;

        this.BufferForUndo = new Array();
        this.BufferForRedo = new Array();
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.CurrentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.CurrentConfig.states[state] == undefined)
        {
            throw new Error();
        }

        this.BufferForUndo.push(this.CurrentState);
        this.CurrentState = state;

        if (this.BufferForRedo.length > 0)
        {
            this.BufferForRedo = [];
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var BufferForNewState = this.CurrentConfig.states[this.CurrentState].transitions[event];

        if (BufferForNewState == undefined)
        {
            throw new Error();           
        }

        this.changeState(BufferForNewState);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this.CurrentConfig.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var ArrayOfStates = Object.keys(this.CurrentConfig.states);
        if (event == undefined)
        {
            return ArrayOfStates;
        }
        else
        {
            for (var index = ArrayOfStates.length - 1; index >= 0; --index)
            {
                if (this.CurrentConfig.states[ArrayOfStates[index]].transitions[event] == undefined)
                {
                    ArrayOfStates.splice(index, 1);
                }
            }
            return ArrayOfStates;
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.BufferForUndo.length == 0)
        {
            return false;
        }
        else
        {
            this.BufferForRedo.push(this.CurrentState)
            this.CurrentState = this.BufferForUndo.pop();

            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.BufferForRedo.length == 0)
        {
            return false;
        }
        else
        {
            this.BufferForUndo.push(this.CurrentState);
            this.CurrentState = this.BufferForRedo.pop();

            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.BufferForUndo = [];
        this.BufferForRedo = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/

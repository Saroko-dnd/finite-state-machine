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

        this.PreviousState = this.CurrentState;
        this.CurrentState = state;
        this.StateBeforeUndo = null;
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

        this.PreviousState = this.CurrentState;
        this.CurrentState = BufferForNewState;
        this.StateBeforeUndo = null;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
       this.CurrentState = this.CurrentConfig.initial;
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
        if (this.PreviousState == null || this.PreviousState == undefined)
        {
            return false;
        }
        else
        {
            this.StateBeforeUndo = this.CurrentState;
            this.CurrentState = this.PreviousState;
            this.PreviousState = null;

            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.StateBeforeUndo == null || this.StateBeforeUndo == undefined)
        {
            return false;
        }
        else
        {
            this.PreviousState = this.CurrentState;
            this.CurrentState = this.StateBeforeUndo;
            this.StateBeforeUndo = null;

            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.StateBeforeUndo = null;
        this.PreviousState = null;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/

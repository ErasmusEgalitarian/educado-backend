export class Answer {
    text: string = "";
    feedback: string = "";
    correct: boolean = false; 
    
    constructor(){}


    /**
     * 
     * @param text - The text to set the answer to
     */
    public setText(text: string) {
        this.text = text;
    }

    /**
     * 
     * @param feedback - The feedback to set the answer to
     */
    public setFeedback(feedback: string) {
        this.feedback = feedback;
    }

    /**
     * 
     * @param correct - The boolean to set the answer to
     */
    public setcorrect(correct: boolean) {
        this.correct = correct;
    }

    public setAll(text: string, feedback: string, correct: boolean) {
        this.text = text;
        this.feedback = feedback;
        this.correct = correct;
    }
    

}
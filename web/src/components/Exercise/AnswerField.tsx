
import { Answer } from "../../interfaces/AnswerClass";

// find a better aleternative to onChange

type Inputs = {
    index: number;
    answerObject: Answer;
    callback: Function;
};



export const AnswerField = ({index, answerObject, callback}:Inputs) => {
    return(
        <div className="flex items-center gap-8 w-full mt-8 items-baseline">
            
            {/** Correct answer button */}
            <div className="form-control w-1/5">
                <label className="label">
                    <span className="label-text">Resposta correta</span> {/**Right answer */}
                </label>    
                    <input type="checkbox" className="" defaultChecked={answerObject.correct} onChange={()=>{answerObject.setcorrect(!answerObject.correct); callback(index, answerObject)}}/> 
            </div>

            {/** Answer text field */}
            <div className="form-control w-2/5">
                <label className="label">
                    <span className="label-text">Resposta</span> {/**Resposta */}
                </label>
                <textarea
                    className="input input-bordered w-full h-16"
                    placeholder="Adicione uma resposta possível ao seu exercício" 
                    onChange={(e) => {answerObject.setText(e.target.value); callback(index, answerObject)}}
                    
                />  {/**Add a possible answer to your exercise */}
            </div>

            {/** Feedback input field*/}
            <div className="form-control w-2/5">
                <label className="label">
                    <span className="label-text">Feedback</span>
                </label>
                <textarea
                    className="input input-bordered w-full h-16"
                    placeholder="Adicione feedback ao seu exercício"
                    onChange={(e) => {
                            answerObject.setFeedback(e.target.value); 
                            callback(index, answerObject);
                        }}    
                />  {/**Add feedback to your exercise */}
            </div>

        </div>
    );
}
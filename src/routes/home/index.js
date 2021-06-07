import 'preact/devtools'
import { Component, createRef, h } from 'preact';
import style from './style.css';


class Countdown extends Component {
	constructor(props){
		super(props);
		this.state = { time: this.props.time };
	}

	componentDidMount() {
		this.timer = setInterval(() => {
			this.setState({ time: this.state.time - 1 });
			if(this.state.time == 1){
				clearInterval(this.timer)
				this.props.setCountDown(this.state.time - 1)
			}
		}, 1000);
	}
  
	render() {
	  return <div >{this.state.time}</div>;
	}
  }

class Home extends Component {
	constructor() {
		super();
		const inputs = [
			"Listen, Morty, I hate to break it to you but what people call \"love\" is just a chemical reaction that compels animals to breed. It hits hard, Morty, then it slowly fades, leaving you stranded in a failing marriage. I did it. Your parents are gonna do it. Break the cycle, Morty. Rise above. Focus on science"
			// "Привіт, як твої справи?",
			// "Type this text so fast, as you can!",
			// "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
		]
		
		this.inputText = inputs[Math.floor(Math.random() * inputs.length)]

		
		this.initialState = {
			gameStarted: false,
			startDate: null,
			words: this.inputText.split(" "),
			wordIndex: -1,
			charIndex: -1,
			inputValue: "",
			finished: false,
			success: false,
			mistake: false,
			userCoundown: 3,
			mistakesMade: 0,
		}
		
		this.state = {
			...this.initialState,
			countDown: this.initialState.userCoundown
		}

		console.log(this.state)
	}
	
	getWordsPerMin() {
		const endDate = new Date()
		
		let takenSeconds = (endDate.getTime() - this.state.startDate.getTime()) / 1000;
		
		const wordsPerMin = Math.round((this.state.words.length / takenSeconds) * 60)
		const symbolsPerMin = Math.round((this.inputText.length / takenSeconds) * 60)
		
		return {
			symbolsPerMin: symbolsPerMin,
			wordsPerMin: wordsPerMin,
			takenSeconds: takenSeconds,
		}
	}
	
	handleKeyUp(evt) {
		const value = evt.target.value
		const chI = value.length - 1

		if (!value.trim()) {
			this.setState({
				...this.state,
				mistake: false,
				charIndex: - 1,
				inputValue: ""
			})
			return
		}

		if (this.state.words[this.state.wordIndex].substring(0, chI+1) !== value.trimRight()) {
			if (this.state.mistake == true){
				this.setState({
					...this.state,
					mistake: true,
					charIndex: chI,
					inputValue: value
				})
			}else{
				this.setState({
					...this.state,
					mistake: true,
					charIndex: chI,
					inputValue: value,
					mistakesMade: this.state.mistakesMade + 1,
				})
			}
		}else {
			this.setState({
				...this.state,
				mistake: false,
				charIndex: chI,
				inputValue: value
			})
		}

		if (evt.keyCode == 32) {
			if (value.trimRight() === this.state.words[this.state.wordIndex]) {
				const nextState = this.state.wordIndex + 1
				
				if (nextState >= this.state.words.length) {
					const stats = this.getWordsPerMin()
					return this.setState({
						...this.state,
						finished: true,
						success: true,
						wordsPerMin: stats.wordsPerMin,
						symbolsPerMin: stats.symbolsPerMin,
						takenSeconds: stats.takenSeconds,
						mistake: false
					})
				}
				
				this.setState({
					...this.state,
					wordIndex: nextState,
					inputValue: "",
					charIndex: -1,
				})
				return
			} 
				
			if(!this.state.mistake){
				this.setState({
				...this.state,
				inputValue: value,
				mistakesMade: this.state.mistakesMade + 1,
				mistake: true
				})
			}
		}
	}
	
	handleChange() {
		if (!this.state.startDate) {
			this.setState({
				...this.state,
				wordIndex: 0,
				startDate: new Date(),
			})
		}
	}
	ref = createRef();
	componentDidUpdate() {
		if (this.ref.current) {
			if (this.ref.current.id == "inputField"){
				this.ref.current.focus()
			}
		}
	}
	

	getChildCountDown(curTime){
		this.setState({...this.state, countDown: curTime})
	}

	showInput(delay){
		if (this.state.gameStarted == false && this.state.countDown == delay) {
			return(
				<button onClick={() => {this.setState({...this.initialState, gameStarted:true})}}>Start competition</button>
				)
		}else if(this.state.gameStarted == true && this.state.countDown > 0) {
			return(
				<div class={style.countDown}>
					<Countdown time={this.state.userCoundown} setCountDown={this.getChildCountDown.bind(this)} />
				</div>
				)
		}
		return(
			<div>
				<input  class={ this.state.mistake ? style.inputFieldMistake : style.inputField} id="inputField" onFocus={this.handleChange.bind(this)} onKeyUp={this.handleKeyUp.bind(this)} value={this.state.inputValue} ref={this.ref} />
			</div>
			)
		
	}

	render() {
		return (
			<div class={style.home}>
				<h1>Klavio</h1>
				<span class={style.mistakeCounter}>Mistakes made: {this.state.mistakesMade}</span>
				<div class={style.unselectable}>
					<div class={this.state.gameStarted ? style.textBox : style.textBoxHidden}>{
						this.state.gameStarted?
							<p class={style.targetText}>{this.state.words.map((word, word_id) => (
								<span key={word_id} class={word_id < this.state.wordIndex && this.state.wordIndex != -1 ? 
									style.typed : word_id == this.state.wordIndex ? style.underline : null} >{word.split('').map((ch, ch_id) => (
									<span  key={ch_id} class={ch_id < this.state.charIndex && this.state.charIndex != -1 && this.state.wordIndex == word_id ?
										style.current : ch_id == this.state.charIndex && this.state.wordIndex == word_id ? style.current : null}>{ch}</span>
									))} </span> 
							))}</p>
						: <div>Text is hidden before game starts</div>
					}</div>
				</div>

				{this.showInput(this.state.userCoundown)}

				<div class={this.state.finished ? style.visible : style.hidden}>
					{this.state.success ? (
						<div>
						<div class={style.mistakeCounter}>Percent of mistakes: {(this.state.mistakesMade * 100 / this.inputText.length).toFixed(2)}%</div>
						<div><h3>Legend!</h3>
						<p>Words per minute <b>{this.state.wordsPerMin}</b></p>
						<p>Symbols per minute <b>{this.state.symbolsPerMin}</b></p>
						<img src="https://media.giphy.com/media/ebFG4jcnC1Ny8/giphy.gif" /></div>
						</div>
					) : 
					(
						<div><h3>Looser...</h3>
						<img src="https://media.giphy.com/media/z7j4LWSvmxIys/giphy.gif" /></div>
					)
				}
					<button onClick={() => this.setState(this.initialState)}>Start over</button>
				</div>
			</div>
		)
	}
}

export default Home;
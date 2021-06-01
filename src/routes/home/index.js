// import { h } from 'preact';
// import style from './style.css';

// const Home = () => (
// 	<div class={style.home}>
// 		<h1>Home</h1>
// 		<p>This is the Home component.</p>
// 	</div>
// );

// export default Home;


import { Component, h } from 'preact';
import style from './style.css';
import {useState, useEffect} from 'preact/hooks'

class Home extends Component {
	constructor() {
		super();

		const inputs = [
			"Привіт, як твої справи?",
			"Type this text so fast, as you can!",
			"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
		]

		this.inputText = inputs[Math.floor(Math.random() * inputs.length)]


		this.initialState = {
			startDate: null,
			words: this.inputText.split(" "),
			wordIndex: -1,
			inputValue: "",
			finished: false,
			success: false,
			maxAttempts: 3,
			currentAttempt: 0,
		}

		this.state = {
			...this.initialState,
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
		if (evt.keyCode == 32) {
			const value = evt.target.value
			if (!value.trim()) return
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
					})
				}

				this.setState({
					...this.state,
					wordIndex: nextState,
					inputValue: "",
				})
			} else {
				const nextAttempt = this.state.currentAttempt + 1
				console.log('failed attempt', nextAttempt)
				if (nextAttempt >= this.state.maxAttempts) {
					return this.setState({
						...this.state,
						finished: true,
					})
				}

				this.setState({
					...this.state,
					currentAttempt: nextAttempt,
				})
			}
		}
	}

	handleChange(evt) {
		console.log("This is evt")
		if (!this.state.startDate) {
			console.log('setting start date')
			this.setState({
				...this.state,
				wordIndex: 0,
				startDate: new Date(),
			})
		}
	}

	render() {
		return (
			<div class={style.home}>
				<h1>Klavio</h1>
				<span>Bro, you have attempts {this.state.maxAttempts - this.state.currentAttempt}</span>
				<p class={style.targetText}>{this.state.words.map((word, id) => (
					<span class={id < this.state.wordIndex && this.state.wordIndex != -1 ? style.active : id == this.state.wordIndex ? style.current : null}>{word} </span> 
				))}</p>
				<input onFocus={this.handleChange.bind(this)} onKeyUp={this.handleKeyUp.bind(this)} value={this.state.inputValue} />
				<div class={this.state.finished ? style.visible : style.hidden}>
					{this.state.success ? (
						<div><h3>Legend!</h3>
						<p>Words per minute <b>{this.state.wordsPerMin}</b></p>
						<p>Symbols per minute <b>{this.state.symbolsPerMin}</b></p>
						<img src="https://media.giphy.com/media/ebFG4jcnC1Ny8/giphy.gif" /></div>
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
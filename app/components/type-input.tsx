import { useEffect, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import { motion } from 'framer-motion'
import { cn } from '#app/utils/misc.tsx'

interface TypeInputProps {
	words: string[]
}

export const TypeInput = ({ words }: TypeInputProps) => {
	const storeRef = useRef(createWordStore(words))
	const store = useStore(storeRef.current)

	const handleKeyPress = (event: KeyboardEvent) => {
		store.keyPress(event.key)
	}

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	})

	return (
		<div className="mx-auto flex max-w-7xl flex-wrap gap-x-3 gap-y-2 p-3 text-4xl">
			{store.words.map((wordState, index) => (
				<span key={index} className="relative">
					<InputDisplay wordState={wordState} />
					{index === store.currentWordIndex && (
						<span className="relative text-blue-500">
							<motion.span
								className="absolute -left-1"
								layoutId="cursor"
								transition={{
									duration: 0.1,
								}}
							>
								|
							</motion.span>
						</span>
					)}
					<span className="text-muted-foreground">
						{getRemainingWordSlice(wordState)}
					</span>
					{isWordWrong(index, store) && (
						<span className="absolute -bottom-[1px] left-0 h-[1px] w-full bg-red-500" />
					)}
				</span>
			))}
		</div>
	)
}

const InputDisplay = ({ wordState }: { wordState: WordState }) => {
	const inputCharacters = wordState.input.split('')

	return (
		<span>
			{inputCharacters.map((char, index) => (
				<span
					key={`${wordState.word}-${index}`}
					className={cn(char !== wordState.word[index] && 'text-red-500')}
				>
					{char}
				</span>
			))}
		</span>
	)
}

const isWordWrong = (index: number, state: State) => {
	const { currentWordIndex, words } = state
	const word = words[index]
	if (!word) return false
	if (index >= currentWordIndex) return false

	return word.input !== word.word
}

const getRemainingWordSlice = (word: WordState) => {
	const remainingWord = word.word.slice(word.input.length)
	return remainingWord
}

type WordState = {
	word: string
	input: string
}

type State = {
	words: Array<WordState>
	currentWordIndex: number
}

type Action = {
	keyPress: (key: string) => void
}

const createWordStore = (words: string[]) =>
	createStore<State & Action>()((set, get) => ({
		words: words.map(word => ({
			word,
			input: '',
		})),
		currentWordIndex: 0,
		keyPress: key => {
			const { words, currentWordIndex } = get()
			const currentWord = words[currentWordIndex]
			const { input } = currentWord

			if (key === 'Backspace') {
				if (input === '') {
					set(state => {
						const newWordIndex = Math.max(0, currentWordIndex - 1)
						return {
							...state,
							currentWordIndex: newWordIndex,
						}
					})
					return
				}
				set(state => ({
					...state,
					words: state.words.map((word, index) => {
						if (index !== currentWordIndex) return word
						return {
							...word,
							input: word.input.slice(0, -1),
						}
					}),
				}))
			}

			if (key === ' ') {
				set(state => ({
					...state,
					currentWordIndex: currentWordIndex + 1,
				}))
				return
			}

			if (key.length === 1) {
				set(state => ({
					...state,
					words: state.words.map((word, index) => {
						if (index !== currentWordIndex) return word
						return {
							...word,
							input: word.input + key,
						}
					}),
				}))
			}
		},
	}))

import { TypeInput } from '#app/components/type-input.tsx'
import { type MetaFunction } from '@remix-run/node'
import { ClientOnly } from 'remix-utils/client-only'

export const meta: MetaFunction = () => [{ title: 'Epic Notes' }]

const words = [
	'hello',
	'world',
	'how',
	'are',
	'you',
	'today',
	'test',
	'something',
	'else',
	'here',
	'is',
	'another',
	'word',
	'for',
	'you',
	'to',
	'type',
	'out',
	'and',
	'it',
	'is',
	'longer',
]

export default function Index() {
	return (
		<main className="relative h-full sm:flex sm:items-center sm:justify-center">
			<ClientOnly>{() => <TypeInput words={words} />}</ClientOnly>
		</main>
	)
}

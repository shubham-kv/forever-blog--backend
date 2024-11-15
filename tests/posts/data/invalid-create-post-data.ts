import {CreatePostDto} from 'src/modules/posts/dto'

type InvalidCreatePostData = Partial<Record<keyof CreatePostDto, unknown>>

export const invalidCreatePostDataValues: InvalidCreatePostData[] = [
	{},

	{title: 1},
	{title: true},
	{title: ''},
	{title: '  '},

	{title: 'foobar'},
	{title: 'foobar', content: 1},
	{title: 'foobar', content: false},
	{title: 'foobar', content: ''},
	{title: 'foobar', content: '  '}
]

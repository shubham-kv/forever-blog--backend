import {UpdatePostDto} from '../../../src/modules/posts/dto'

type InvalidUpdatePostData = Partial<Record<keyof UpdatePostDto, unknown>>

export const invalidUpdatePostDataValues: InvalidUpdatePostData[] = [
	{},

	{title: 1},
	{title: true},
	{title: ''},
	{title: '  '},

	{title: 'foobar', content: 1},
	{title: 'foobar', content: false},
	{title: 'foobar', content: ''}
]

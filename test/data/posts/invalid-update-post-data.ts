import {UpdatePostDto} from '@/modules/posts/dto'

type InvalidUpdatePostData = Partial<Record<keyof UpdatePostDto, unknown>>

export const invalidUpdatePostData: InvalidUpdatePostData[] = [
	{},

	{title: 1},
	{title: true},
	{title: ''},
	{title: '  '},

	{title: 'foobar', content: 1},
	{title: 'foobar', content: false},
]

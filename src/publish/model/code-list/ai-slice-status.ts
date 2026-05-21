export default {
  codeListTag: 'ai__slice_status',
  codeListType: 'STATIC',
  codeName: 'ai__slice_status',
  emptyText: '未定义',
  codeItems: [
    {
      codeName: 'unparsed',
      sysImage: {
        rawContent:
          '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1766979301380" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6088" width="8" height="8" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M512 512m-368 0a368 368 0 1 0 736 0 368 368 0 1 0-736 0Z" fill="#7B61FF" p-id="6089"></path></svg>',
      },
      text: '未解析',
      value: '0',
      id: 'unparsed',
    },
    {
      codeName: 'ready',
      sysImage: {
        rawContent:
          '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1766979301380" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6088" width="8" height="8" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M512 512m-368 0a368 368 0 1 0 736 0 368 368 0 1 0-736 0Z" fill="#00B670" p-id="6089"></path></svg>',
      },
      text: '就绪',
      userData: 'READY',
      value: '1',
      id: 'ready',
    },
    {
      codeName: 'chunk_pending',
      sysImage: {
        rawContent:
          '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1766979301380" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6088" width="8" height="8" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M512 512m-368 0a368 368 0 1 0 736 0 368 368 0 1 0-736 0Z" fill="#FFC145" p-id="6089"></path></svg>',
      },
      text: '待切片',
      value: '3',
      id: 'chunk_pending',
    },
    {
      codeName: 'parsing',
      sysImage: {
        rawContent:
          '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1766979301380" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6088" width="8" height="8" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M512 512m-368 0a368 368 0 1 0 736 0 368 368 0 1 0-736 0Z" fill="#FF8A00" p-id="6089"></path></svg>',
      },
      text: '解析中',
      value: '2',
      id: 'parsing',
    },
    {
      codeName: 'chunking',
      sysImage: {
        rawContent:
          '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1766979301380" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6088" width="8" height="8" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M512 512m-368 0a368 368 0 1 0 736 0 368 368 0 1 0-736 0Z" fill="#3A8CFF" p-id="6089"></path></svg>',
      },
      text: '切片中',
      value: '4',
      id: 'chunking',
    },
    {
      codeName: 'failed',
      sysImage: {
        rawContent:
          '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1766979301380" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6088" width="8" height="8" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M512 512m-368 0a368 368 0 1 0 736 0 368 368 0 1 0-736 0Z" fill="#F5222D" p-id="6089"></path></svg>',
      },
      text: '失败',
      userData: 'FAILED',
      value: '99',
      id: 'failed',
    },
  ],
  enableCache: true,
  name: '文档切片状态',
  id: 'plmweb.ai__slice_status',
};

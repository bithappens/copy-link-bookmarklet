import bookmarkleter from 'bookmarkleter'

document.querySelector<HTMLAnchorElement>('#bml_md')!.href =
    bookmarkleter("javascript: alert('hi foo');", { urlencode: false, minify: true, iife: true })

 // javascript:void%20function(){javascript:alert(%22hi%20foo%22)}();

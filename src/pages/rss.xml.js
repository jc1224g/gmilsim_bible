import rss from '@astrojs/rss';
import { SITE } from '../../site.config.mjs';
import { getPosts, postUrl } from '../lib/posts';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site,
    items: posts.map((p) => ({
      title: `제${p.data.no}강 ${p.data.title}`,
      pubDate: p.data.date,
      description: p.data.summary,
      link: postUrl(p),
      categories: p.data.tags,
    })),
    customData: '<language>ko</language>',
  });
}

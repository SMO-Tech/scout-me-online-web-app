export const getYouTubeId = (url: string) =>
  url.split('v=')[1]?.split('&')[0] || url.split('youtu.be/')[1]?.split('?')[0] || null

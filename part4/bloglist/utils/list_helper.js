const collection = require('lodash/collection')
const math = require('lodash/math')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (fav, item) => {
    return fav.likes > item.likes
      ? fav
      : item
  }
  return blogs.length === 0
    ? undefined
    : blogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {
  const grouped = collection.groupBy(blogs, (b) => (b.author))
  console.log(grouped)
  const counted = Object.keys(grouped).map((a) => ({"author": a, "blogs": grouped[a].length}))
  return math.maxBy(counted, (i) => (i.blogs))
}

const mostLikes = (blogs) => {
  const grouped = collection.groupBy(blogs, (b) => (b.author))
  const counted = Object.keys(grouped).map((a) => {
    return {
      "author": a, 
      "likes": grouped[a].reduce((sum, item) => (sum + item.likes), 0)}
  })
  return math.maxBy(counted, (i) => (i.likes))
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
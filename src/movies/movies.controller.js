const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const movie = await moviesService.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

function read(req, res, next) {
  const { movie: data } = res.locals;
  res.json({ data });
}

async function list(req, res, next) {
  const isShowing = req.query.is_showing;
  if (isShowing) {
    const data = await moviesService.listMoviesIfShowing();
    return res.json({ data });
  }
  const data = await moviesService.list();
  return res.json({ data });
}

async function listTheatersByMovie(req, res, next) {
  const data = await moviesService.listTheatersByMovie(
    res.locals.movie.movie_id
  );
  res.json({ data });
}

async function listReviewsByMovie(req, res, next) {
  const data = await moviesService.listReviewsByMovie(
    res.locals.movie.movie_id
  );
  res.json({ data });
}

module.exports = {
  read: [asyncErrorBoundary(movieExists), read],
  list: asyncErrorBoundary(list),
  listTheatersByMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listTheatersByMovie),
  ],
  listReviewsByMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listReviewsByMovie),
  ],
};

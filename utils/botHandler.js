const handleRobotsTxt = (req, res) => {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /api/\nDisallow: /admin/");
  };
  
  const handleAdsTxt = (req, res) => {
    res.type('text/plain');
    res.send("# No ads configuration");
  };
  
  module.exports = {
    handleRobotsTxt,
    handleAdsTxt
  };
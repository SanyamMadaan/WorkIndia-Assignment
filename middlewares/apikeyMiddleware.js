const validateApiKey = (req, res, next) => {
  console.log(req.headers);
    const apiKey = req.headers['admin-api-key'];
    console.log(apiKey);
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ error: 'Invalid API Key' });
    }
    next();
  };
  
module.exports=validateApiKey;
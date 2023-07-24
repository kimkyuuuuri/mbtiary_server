const axios = require("axios");
const { response } = require("../../config/response");
const baseResponse = require("../../config/baseResponseStatus");
const authService = require("./auth.service");

exports.kakaoLogin = async function (req, res) {
  const { access_token } = req.body;

  const loginResponse = await axios
    .get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-type": "application/json",
      },
    })
    .then((response) => {
      const r = authService.kakaoLogin(response.data.kakao_account.email);

      return r;
    })
    .catch((error) => {
      return response(baseResponse.SERVER_ERROR);
    });

  return res.send(loginResponse);
};

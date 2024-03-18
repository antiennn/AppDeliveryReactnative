import axios from "axios";

export const endpoints = {
  'register': "/users/register/",
  'login': '/o/token/',
  'current-user':'/users/current_user/',
  'post':'/post/create_post/',
  'coupon':'/coupon/',
  'newest':'/post/newest/',
  'getpost':'/post/',
  'getpostnearyou':(obj)=>`/post/?latitude=${obj.latitude}&longitude=${obj.longitude}`,
  'auction': (postId) => `/post/${postId}/auction/`,
  'myauction':'/auction/my_auction/',
  'updateauction': (Auctionid)=>`/auction/${Auctionid}/update_auction/`,
  'deleteauction':(Auctionid)=>`/auction/${Auctionid}/`,
  'mypost':'/post/my_post/',
  'create_payment':'/vnpay/payment_url/',
  'accept_auction':(Postid)=>`/post/${Postid}/accept_auction/`,
  'complete_delivery':`/post/complete_delivery/`,
  'deletepost':(Postid)=>`/post/${Postid}/`,
  'mypostcomplete':'/post/my_post_complete/',
  'postrate':'/post/post_rate/',
  'rate':(id)=>`/rate/?id=${id}`,
  'notice':'/notification/',
  'them-category':(name)=> `/categories/?name=${name}`,
};
export const authApi = (accessToken) =>
  axios.create({
    baseURL: "http://192.168.1.50:5500/",
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
  });

export default axios.create({
  baseURL: "http://192.168.1.50:5500/",
});

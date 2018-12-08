export default {
  data: function() {
    return {
      saved: true
    };
  },

  props: ["msg"],
  template: `
  <p>Single Page Component: {{msg}}</p>  
    `
};


//originally from sharing3.js


var tweetTpl = new Ext.XTemplate(
    
  '<tpl for=".">',
    '<div class="clearfix tweet">',
       '<img src="{profile_image_url}" />',
       
                '<div class="tweet-bubble">',
                    '<div class="tweet-content">',
                        '<p>{text}</p><strong></strong>',
                        '<h2>@{screen_name} - <span class="posted">{created_at}</span></h2>',                        
                    '</div>',                    
                '</div>',
            '</div>',
        '</div>',        
    '</tpl>'
    , {
      compiled: true
      
    });

//from sharing4.js -- for detailedTweet

var tplTweet = new Ext.XTemplate([
  '<tpl for=".">', 
    '<div class="twDetail">',
    '<p class="tweet">{text}</p>', 
    '<p class="sourceInfo">Sent: {created_at_long}</p>',
    '</div>',
  '</tpl>'
]);

var tplTweetAuthor = new Ext.XTemplate([
  '<tpl for=".">',
    '<div class="clearfix authorDetails">',  
      '<img src="{profile_image_url}"/>',
      '<div class="authorDetail">',
        '<h2>@{screen_name}</h2>',
      '</div></div>',
   '</tpl>']);
    
   
//originally from voices.js


var authorAbstract = new Ext.XTemplate([
  '<tpl for=".">',
    '<div class="clearfix authorDetails">',  
      '<img src="{profile_image_url}"/>',
      '<div class="authorDetail">',
        '<h2>{name}</h2><h3>@{screen_name}</h3>',
      '</div></div>',
   '</tpl>']);

var voiceTpl = new Ext.XTemplate([
  '<tpl for=".">',
    '<tpl if="xindex &lt; 11">',
    '<div class="clearfix ranking li{#}">' ,
    '<div class="clearfix authorDetails">',
      '<img src="{profile_image_url}"/>',
      '<div class="authorDetail">',
        '<h2>{screen_name}</h2>{attending}', //<h3>{author_at_name}</h3>',
      '</div>',
      '</div></div></div>',
     '</tpl>',
     '<tpl if="xindex &gt; 10">',
     '<div class="clearfix unranked">' ,
      '<div class="clearfix authorDetails">',          
        '<img src="{profile_image_url}"/>',
          '<div class="authorDetail">',
            '<h2>{screen_name}</h2>', //<h3>{author_at_name}</h3>',
          '</div>',
      '</div></div></div>',
      '</tpl>',
   '</tpl>' ]);


var authorDetail = new Ext.XTemplate([
  '<tpl for=".">',
    '<table  class="authorDetails">',
      '<tbody>',
      '<tpl if="location.length != 0">',
      '<tr class="top">',
        '<td colspan="2"><span>Location:</span> {location}</td>',
      '</tr>',
      '</tpl>',
      '<tpl if="description.length != 0">',
      '<tr >',
        '<td colspan="2">',
          '<p>{description}</p>',
        '</td>',
      '</tr>',
      '</tpl>',
      '<tr class="stats">',
        '<td>',
          '<h3>{friends_count}</h3>',
          '<span>following</span>',
        '</td>',
        '<td>',
          '<h3>{followers_count}</h3>',
          '<span>followers</span>',
        '</td>',
      '</tr>',
      '<tr class="stats">',
        '<td>',
          '<h3>{listed_count}</h3>',
          '<span>listed</span>',
        '</td>',
        '<td>',
          '<h3>{statuses_count}</h3>',
          '<span>tweets</span>',
        '</td>',
      '</tr>',
      '<tr class="stats bot">',
        '<tpl if="is_attendee === true">',
        '<td colspan="2" class="attendee">',
        '</tpl>', 
        '<tpl if="is_attendee === false">',
        '<td colspan="2">',
        '</tpl>', 
          'Is ', 
          
          '<tpl if="is_attendee === false">',
          'NOT ',
          '</tpl>',
          'at the 2010 Sencha Conference',
        '</td>',
      '</tr>',
      '</tbody>',
  '</table>',
  '</tpl>']);   
   
   
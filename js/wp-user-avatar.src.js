// Media uploader
function wpuaMediaUploader(section, edit_text, insert_text){
  wp.media.wpUserAvatar = {
    get: function(){
      return wp.media.view.settings.post.wpUserAvatarId;
    },
    set: function(id){
      var settings = wp.media.view.settings;
      settings.post.wpUserAvatarId = id;
      settings.post.wpUserAvatarSrc = jQuery('div.attachment-info').find('img').attr('src');
      if(settings.post.wpUserAvatarId){
        wpuaSetAvatar(settings.post.wpUserAvatarId, settings.post.wpUserAvatarSrc);
        jQuery('#wp_user_avatar_radio').trigger('click');
      }
    },
    frame: function(){
      if(this._frame){
        return this._frame;
      }
      this._frame = wp.media({
        state: 'library',
        states: [ new wp.media.controller.Library({ title: edit_text + ": " + section }) ]
      });
      this._frame.on('open', function(){
        var selection = this.state().get('selection');
        id = jQuery('#wp-user-avatar').val();
        attachment = wp.media.attachment(id);
        attachment.fetch();
        selection.add(attachment ? [ attachment ] : []);
      }, this._frame);
      this._frame.on('toolbar:create:select', function(toolbar){
        this.createSelectToolbar(toolbar, {
          text: insert_text
        });
      }, this._frame);
      this._frame.state('library').on('select', this.select);
      return this._frame;
    },
    select: function(id){
      var settings = wp.media.view.settings,
         selection = this.get('selection').single();
      wp.media.wpUserAvatar.set(selection ? selection.id : -1);
    },
    init: function(){
      jQuery('body').on('click', '#wpua-add', function(e){
        e.preventDefault();
        e.stopPropagation();
        wp.media.wpUserAvatar.frame().open();
      });
    }
  };
  jQuery(wp.media.wpUserAvatar.init);
}

// Set WP User Avatar
function wpuaSetAvatar(attachment, imageURL){
  jQuery('#wp-user-avatar', window.parent.document).val(attachment);
  jQuery('#wpua-preview', window.parent.document).find('img').attr('src', imageURL).removeAttr('width', "").removeAttr('height', "");
  jQuery('#wpua-message', window.parent.document).show();
  jQuery('#wpua-remove', window.parent.document).removeClass('wpua-hide').show();
  jQuery('#wpua-thumbnail', window.parent.document).hide();
  jQuery('#wp_user_avatar_radio', window.parent.document).trigger('click');
  wp.media.wpUserAvatar.frame().close()
}

// Remove WP User Avatar
function wpuaRemoveAvatar(avatar_thumb){
  jQuery('body').on('click', '#wpua-remove', function(e){
    e.preventDefault();
    jQuery(this).hide();
    jQuery('#wpua-edit, #wpua-thumbnail').hide();
    jQuery('#wpua-preview').find('img').attr('src', avatar_thumb).removeAttr('width', "").removeAttr('height', "");
    jQuery('#wp-user-avatar').val("");
    jQuery('#wpua-message').show();
    jQuery('#wp_user_avatar_radio').trigger('click');
  });
}

jQuery(function(){
  // Add enctype to form with JavaScript as backup
  jQuery('#your-profile').attr('enctype', 'multipart/form-data');
  // Remove/edit settings
  if(typeof(wp) != 'undefined'){
    wpuaMediaUploader(wpua_custom.section, wpua_custom.edit_image, wpua_custom.select_image);
  }
  wpuaRemoveAvatar(wpua_custom.avatar_thumb);
});

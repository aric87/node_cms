# node_cms

TODO:
create macros for common templates, and a way to include into default client templates

build route in hermod that accepts config values for smtp connection

change template engine to handlebars

build routes for
/:slug
/contact_form

/admin
	- homepage, lists with links to edit pages, create page, create new users, edit users

/admin/details
 - view/edit details about the account, business name, address, hours, social media links etc,

/admin/details/superAdmin
 - edit client info ie. NGINX code, email config

/admin/pages
 - list pages, quick toggle on/off
	/admin/pages/:slug
 		- view/ edit page contents, turn on/off
	/admin/pages/preview/:slug
  - preview inactive page

/admin/users
 - list, toggle, delete users

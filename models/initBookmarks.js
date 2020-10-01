exports.initBookmarks = function (){
    const BookmarksRepository = require('./Repository.js');
    const Bookmark = require('./bookmark.js');
    const bookmarksRepository = new BookmarksRepository("bookmarks");
    bookmarksRepository.add(new Bookmark('Google','https://www.google.ca/','Moteur de recherche')); 
    bookmarksRepository.add(new Bookmark('New York Post','https://nypost.com/','News')); 
    bookmarksRepository.add(new Bookmark('RDS','https://www.rds.ca/','Sports')); 
    bookmarksRepository.add(new Bookmark('TVA Nouvelles','https://www.tvanouvelles.ca/','News')); 
    bookmarksRepository.add(new Bookmark('Youtube','https://www.youtube.com/','Réseau social')); 
    bookmarksRepository.add(new Bookmark('Collège Lionel-Groulx','http://www.clg.qc.ca/','École')); 
    bookmarksRepository.add(new Bookmark('Twitch','https://www.twitch.tv/','Streaming')); 
    bookmarksRepository.add(new Bookmark('Facebook','https://www.facebook.com/','Réseau social')); 
}
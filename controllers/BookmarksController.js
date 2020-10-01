const Repository = require('../models/Repository');

module.exports = 
class BookmarksController extends require('./Controller') {
    constructor(req, res){
        super(req, res);
        this.bookmarksRepository = new Repository('Bookmarks');
    }

    get(id){
        let params = this.getQueryStringParams();
        if(!isNaN(id))
            this.response.JSON(this.bookmarksRepository.get(id));
        else if(params == null)
            this.response.JSON(this.bookmarksRepository.getAll());
        else if(Object.keys(params).length === 0)
        {
            this.help();
        }
        else
            this.response.JSON(this.checkSort(params));
    }
    post(bookmark){  
        if(this.checkValidBookmark(bookmark) && this.checkDuplicate(bookmark))
        {
            let newBookmark = this.bookmarksRepository.add(bookmark);
            if (newBookmark)
                this.response.created(newBookmark);
            else
                this.response.internalError();
        }else{
            this.response.badRequest();
        }
    }
    put(bookmark){
        if(this.checkValidBookmark(bookmark)){
            if (this.bookmarksRepository.update(bookmark))
                this.response.ok();
            else 
                this.response.notFound();
        }
    }
    remove(id){
        if (this.bookmarksRepository.remove(id))
            this.response.accepted();
        else
            this.response.notFound();
    }

    help() {
        // expose all the possible query strings
        let content = "<div style=font-family:arial>";
        content += "<h3>GET : api/bookmarks endpoint  <br> List of possible query strings:</h3><hr>";
        content += "<h4>? sort=name <br>voir tous les bookmarks tries ascendant par Name </h4>";
        content += "<h4>? sort=category <br>voir tous les bookmarks tries descendant par Category </h4>";
        content += "<h4>/id <br>voir le bookmark Id</h4>";
        content += "<h4>?name=nom <br>voir le bookmark avec Name = nom</h4>";
        content += "<h4>?name=ab* <br>voir tous les bookmarks avec Name commençant par ab</h4>";
        content += "<h4>?category=sport <br>voir tous les bookmarks avec Category = sport</h4>";
        content += "<h4>? <br>Voir la liste des parametres supportes</h4>";
        this.res.writeHead(200, {'content-type':'text/html'});
        this.res.end(content) + "</div>";
    }

    checkSort(params){
        let jsonObj = this.bookmarksRepository.getAll();
        if('sort' in params)
        {
            switch(params.sort)
            {
                case 'name':
                    jsonObj = jsonObj.sort((a,b)=> ("" + a.Name).localeCompare(b.Name));
                    break;
                case 'category':
                    jsonObj = jsonObj.sort((a,b)=> ("" + b.Category).localeCompare(a.Category));
                    break;
                default:
                    return this.error(params, "unknown operation");
            }
        }

        if('category' in params)
            jsonObj = jsonObj.filter((a) => a.Category == params.category);

        if('name' in params)
        {
            if((params.name + "").slice(-1) == '*')
            {
                params.name = (params.name + "").slice(0,-1);
                jsonObj = jsonObj.filter((a) => (a.Name + "").startsWith(params.name));
            }
            else
            {
                let tempObj = {};
                for(let object of jsonObj){
                    if (object.Name === params.name)
                    tempObj = object;
                }
                jsonObj = tempObj;
            }
        }
        return jsonObj;
    }

    checkValidBookmark(bookmark){
        if(Object.keys(bookmark).length == 4){
            if(!bookmark.hasOwnProperty('Id'))
                return false;
            
            if(!bookmark.hasOwnProperty('Name'))
                return false;

            if(!bookmark.hasOwnProperty('Category'))
                return false;

            if(!bookmark.hasOwnProperty('Url'))
                return false;
        }else
            return false;
        return true;
    }

    checkDuplicate(bookmark){
        let jsonObj = this.bookmarksRepository.getAll();
        for(let object of jsonObj){
            if (bookmark.Name === object.Name)
                return false;
        }
        return true;
    }
}
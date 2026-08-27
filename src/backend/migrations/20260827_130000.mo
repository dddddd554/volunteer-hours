import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Array "mo:core/Array";

module {
  type UserRole = {
    #admin;
    #user;
    #guest;
  };

  type OldActivity = {
    id : Nat;
    title : Text;
    hours : Nat;
    date : Text;
    createdAt : Int;
  };

  type NewActivity = {
    id : Nat;
    title : Text;
    hours : Nat;
    date : Text;
    createdAt : Int;
    image : Blob;
    filename : Text;
  };

  type OldActor = {
    accessControlState : {
      var adminAssigned : Bool;
      userRoles : Map.Map<Principal, UserRole>;
    };
    activities : Map.Map<Principal, List.List<OldActivity>>;
    state : { var nextId : Nat };
  };

  type NewActor = {
    accessControlState : {
      var adminAssigned : Bool;
      userRoles : Map.Map<Principal, UserRole>;
    };
    activities : Map.Map<Principal, List.List<NewActivity>>;
    state : { var nextId : Nat };
  };

  public func migration(old : OldActor) : NewActor {
    let emptyImage = Array.toBlob([] : [Nat8]);
    let activities = old.activities.map<Principal, List.List<OldActivity>, List.List<NewActivity>>(
      func(_, list) {
        let newList = List.empty<NewActivity>();
        for (a in list.values()) {
          newList.add({
            id = a.id;
            title = a.title;
            hours = a.hours;
            date = a.date;
            createdAt = a.createdAt;
            image = emptyImage;
            filename = "";
          });
        };
        newList
      }
    );
    {
      accessControlState = old.accessControlState;
      activities;
      state = old.state;
    };
  };
};

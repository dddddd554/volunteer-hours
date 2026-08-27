import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  type UserRole = {
    #admin;
    #user;
    #guest;
  };

  type Activity = {
    id : Nat;
    title : Text;
    hours : Nat;
    date : Text;
    createdAt : Int;
  };

  type OldActor = {
    accessControlState : {
      var adminAssigned : Bool;
      userRoles : Map.Map<Principal, UserRole>;
    };
  };

  type NewActor = {
    accessControlState : {
      var adminAssigned : Bool;
      userRoles : Map.Map<Principal, UserRole>;
    };
    activities : Map.Map<Principal, List.List<Activity>>;
    state : { var nextId : Nat };
  };

  public func migration(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      activities = Map.empty();
      state = { var nextId = 0 };
    };
  };
};

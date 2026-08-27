import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Storage "mo:caffeineai-object-storage/Storage";
import Types "../types/activity";

module {
  public func addActivity(
    activities : Map.Map<Principal, List.List<Types.Activity>>,
    state : { var nextId : Nat },
    caller : Principal,
    title : Text,
    hours : Nat,
    date : Text,
    image : Storage.ExternalBlob,
    filename : Text,
  ) : Types.Activity {
    let activity : Types.Activity = {
      id = state.nextId;
      title;
      hours;
      date;
      createdAt = Time.now();
      image;
      filename;
    };
    state.nextId += 1;
    switch (activities.get(caller)) {
      case (?list) { list.add(activity) };
      case null {
        let list = List.empty<Types.Activity>();
        list.add(activity);
        activities.add(caller, list);
      };
    };
    activity
  };

  public func listActivities(
    activities : Map.Map<Principal, List.List<Types.Activity>>,
    caller : Principal,
  ) : [Types.Activity] {
    switch (activities.get(caller)) {
      case (?list) { list.toArray() };
      case null { [] };
    };
  };
};

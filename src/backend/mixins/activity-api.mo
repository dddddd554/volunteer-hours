import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "mo:caffeineai-object-storage/Storage";
import Types "../types/activity";
import ActivityLib "../lib/activity";

mixin (
  activities : Map.Map<Principal, List.List<Types.Activity>>,
  state : { var nextId : Nat },
) {
  public shared ({ caller }) func addActivity(
    title : Text,
    hours : Nat,
    date : Text,
    image : Storage.ExternalBlob,
    filename : Text,
  ) : async Types.Activity {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized");
    };
    ActivityLib.addActivity(activities, state, caller, title, hours, date, image, filename)
  };

  public query ({ caller }) func listActivities() : async [Types.Activity] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized");
    };
    ActivityLib.listActivities(activities, caller)
  };
};

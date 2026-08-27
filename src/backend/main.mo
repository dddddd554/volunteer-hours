import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import OQL "mo:caffeineai-oql";
import Entity "mo:caffeineai-oql/Entity";
import Expose "mo:caffeineai-oql/Expose";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import IntValue "mo:caffeineai-oql/IntValue";
import BlobValue "mo:caffeineai-oql/BlobValue";
import Types "types/activity";
import ActivityApi "mixins/activity-api";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  include MixinObjectStorage();

  let activities : Map.Map<Principal, List.List<Types.Activity>>;
  let state : { var nextId : Nat };

  include ActivityApi(activities, state);

  func activityIter(p : ?Principal) : Iter.Iter<Types.Activity> {
    switch (p) {
      case (?owner) {
        switch (activities.get(owner)) {
          case (?list) { list.values() };
          case null { Iter.empty() };
        };
      };
      case null {
        let all = List.empty<Types.Activity>();
        for ((_, list) in activities.entries()) {
          for (a in list.values()) {
            all.add(a);
          };
        };
        all.values();
      };
    };
  };

  include Expose({
    entities = [
      OQL.Entity.newScoped<Types.Activity>("activity", activityIter, "Activity", "id")
        .sample({ id = 0; title = ""; hours = 0; date = ""; createdAt = 0; image = Array.toBlob([] : [Nat8]); filename = "" })
        .scopedPerUser()
        .build(),
    ];
  });
};

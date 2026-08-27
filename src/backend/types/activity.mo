import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type Activity = {
    id : Nat;
    title : Text;
    hours : Nat;
    date : Text;
    createdAt : Int;
    image : Storage.ExternalBlob;
    filename : Text;
  };
};

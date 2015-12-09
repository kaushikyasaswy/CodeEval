/**
 * 
 */
package edu.upenn.cis573.friends;

import static org.junit.Assert.*;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

import org.junit.Test;

/**
 * @author shashank
 *
 */
public class SuggestFriendTest {

	/**
	 * I have no friends
	 */
	@Test
	public void testNoFriends() {
		FriendFinder ff = new FriendFinder() {
			protected DataSource factoryDataSource(String arg) {
				return new FriendsDataSource() {
					public List<String> get(String arg) {
						if (arg.equals("Shash")) {
							return new ArrayList<String>() {
							};
						}
						return null;
					}
				};
			}
		};
		String suggestedFriend = ff.suggestFriend("Shash");
		assertEquals(null, suggestedFriend);
	}

	/**
	 * I have at least two friends; they have no friends except for me
	 */
	@Test
	public void testNoCommonFriendsExceptMe() {
		FriendFinder ff = new FriendFinder() {
			protected DataSource factoryDataSource(String arg) {
				return new FriendsDataSource() {
					public List<String> get(String arg) {
						if (arg.equals("Shash")) {
							return new ArrayList<String>(Arrays.asList("Vlad", "Tiago"));
						}
						if (arg.equals("Vlad")) {
							return new ArrayList<String>(Arrays.asList("Shash"));
						}
						if (arg.equals("Tiago")) {
							return new ArrayList<String>(Arrays.asList("Shash"));
						}
						return null;
					}
				};
			}
		};
		String suggestedFriend = ff.suggestFriend("Shash");
		assertEquals(null, suggestedFriend);
	}

	/**
	 * I have at least two friends; those friends are also friends with each
	 * other, and with me, but with no one else
	 */
	@Test
	public void NoCommonFriendsExceptMeAndMyFriends() {
		FriendFinder ff = new FriendFinder() {
			protected DataSource factoryDataSource(String arg) {
				return new FriendsDataSource() {
					public List<String> get(String arg) {
						if (arg.equals("Shash")) {
							return new ArrayList<String>(Arrays.asList("Vlad", "Tiago"));
						}
						if (arg.equals("Vlad")) {
							return new ArrayList<String>(Arrays.asList("Shash", "Tiago"));
						}
						if (arg.equals("Tiago")) {
							return new ArrayList<String>(Arrays.asList("Shash", "Vlad"));
						}
						return null;
					}
				};
			}
		};
		String suggestedFriend = ff.suggestFriend("Shash");
		assertEquals(null, suggestedFriend);
	}

	/**
	 * I have exactly one friend; she has exactly two friends
	 */
	@Test
	public void testExactOneTransitiveFriend() {
		FriendFinder ff = new FriendFinder() {
			protected DataSource factoryDataSource(String arg) {
				return new FriendsDataSource() {
					public List<String> get(String arg) {
						if (arg.equals("Shash")) {
							return new ArrayList<String>(Arrays.asList("Stacy"));
						}
						if (arg.equals("Stacy")) {
							return new ArrayList<String>(Arrays.asList("Shash", "Tiago"));
						}
						return null;
					}
				};
			}
		};
		String suggestedFriend = ff.suggestFriend("Shash");
		assertEquals("Tiago", suggestedFriend);
	}

	/**
	 * I have exactly one friend; she has at least three friends
	 */
	@Test
	public void testMoreThanOneTransitiveFriend() {
		FriendFinder ff = new FriendFinder() {
			protected DataSource factoryDataSource(String arg) {
				return new FriendsDataSource() {
					public List<String> get(String arg) {
						if (arg.equals("Shash")) {
							return new ArrayList<String>(Arrays.asList("Stacy"));
						}
						if (arg.equals("Stacy")) {
							return new ArrayList<String>(Arrays.asList("Shash", "Tiago", "Vlad"));
						}
						return null;
					}
				};
			}
		};
		String suggestedFriend = ff.suggestFriend("Shash");
		assertEquals(true, suggestedFriend.equals("Tiago") || suggestedFriend.equals("Vlad"));
	}

	/**
	 * I have exactly two friends; they have exactly two friends: me and another
	 * person (both of my friends are friends with the same other person, who is
	 * not one of my friends)
	 */
	@Test
	public void testExactOneCommonTransitiveFriend() {
		FriendFinder ff = new FriendFinder() {
			protected DataSource factoryDataSource(String arg) {
				return new FriendsDataSource() {
					public List<String> get(String arg) {
						if (arg.equals("Shash")) {
							return new ArrayList<String>(Arrays.asList("Stacy", "Kacy"));
						}
						if (arg.equals("Stacy")) {
							return new ArrayList<String>(Arrays.asList("Shash", "Tiago"));
						}
						if (arg.equals("Kacy")) {
							return new ArrayList<String>(Arrays.asList("Shash", "Tiago"));
						}
						return null;
					}
				};
			}
		};
		String suggestedFriend = ff.suggestFriend("Shash");
		assertEquals("Tiago", suggestedFriend);
	}

	/**
	 * I have at least two friends; they all have at least three friends (me and
	 * at least two other people); none of those friends-of-friends are the same
	 * person, i.e. my friends don't have any friends in common except for me
	 */
	@Test
	public void testNoCommonTransitiveFriends() {
		FriendFinder ff = new FriendFinder() {
			protected DataSource factoryDataSource(String arg) {
				return new FriendsDataSource() {
					public List<String> get(String arg) {
						if (arg.equals("Shash")) {
							return new ArrayList<String>(Arrays.asList("Stacy", "Kacy"));
						}
						if (arg.equals("Stacy")) {
							return new ArrayList<String>(Arrays.asList("Shash", "Tiago", "Vlad"));
						}
						if (arg.equals("Kacy")) {
							return new ArrayList<String>(Arrays.asList("Shash", "Howard", "Hans"));
						}
						return null;
					}
				};
			}
		};
		String suggestedFriend = ff.suggestFriend("Shash");
		ArrayList<String> expectedSuggestedFriends = new ArrayList<String>(
				Arrays.asList("Tiago", "Vlad", "Howard", "Hans"));
		assertEquals(true, expectedSuggestedFriends.contains(suggestedFriend));
	}

	/**
	 * I have at least three friends; they all have at least three friends (me
	 * and at least two other people); all of my friends are friends with person
	 * A, who is not one of my friends; all but one of my friends are friends
	 * with person B, who is not one of my friends; none of my friends have any
	 * friends in common except for A and B
	 */
	@Test
	public void testHighestCommonTransitiveFriends() {
		FriendFinder ff = new FriendFinder() {
			protected DataSource factoryDataSource(String arg) {
				return new FriendsDataSource() {
					public List<String> get(String arg) {
						if (arg.equals("Shash")) {
							return new ArrayList<String>(Arrays.asList("Stacy", "Kacy", "Macy"));
						}
						if (arg.equals("Stacy")) {
							return new ArrayList<String>(Arrays.asList("Shash", "Tiago", "Vlad"));
						}
						if (arg.equals("Kacy")) {
							return new ArrayList<String>(Arrays.asList("Shash", "Tiago", "Vlad"));
						}
						if (arg.equals("Macy")) {
							return new ArrayList<String>(Arrays.asList("Shash", "Tiago", "Hans"));
						}
						return null;
					}
				};
			}
		};
		String suggestedFriend = ff.suggestFriend("Shash");
		assertEquals("Tiago", suggestedFriend);
	}

	/**
	 * I have exactly three friends; they all have exactly four friends (me and
	 * exactly three other people); all of my friends are friends with both
	 * person A and person B, who are not one of my friends; none of my friends
	 * have any friends in common except for A and B
	 */
	@Test
	public void testMultipleHighestCommonTransitiveFriends() {
		FriendFinder ff = new FriendFinder() {
			protected DataSource factoryDataSource(String arg) {
				return new FriendsDataSource() {
					public List<String> get(String arg) {
						if (arg.equals("Shash")) {
							return new ArrayList<String>(Arrays.asList("Stacy", "Kacy", "Macy"));
						}
						if (arg.equals("Stacy")) {
							return new ArrayList<String>(Arrays.asList("Shash", "Tiago", "Vlad", "Howard"));
						}
						if (arg.equals("Kacy")) {
							return new ArrayList<String>(Arrays.asList("Shash", "Tiago", "Vlad", "Hans"));
						}
						if (arg.equals("Macy")) {
							return new ArrayList<String>(Arrays.asList("Shash", "Tiago", "Vlad", "Amra"));
						}
						return null;
					}
				};
			}
		};
		String suggestedFriend = ff.suggestFriend("Shash");
		ArrayList<String> expectedSuggestedFriends = new ArrayList<String>(Arrays.asList("Tiago", "Vlad"));
		assertEquals(true, expectedSuggestedFriends.contains(suggestedFriend));
	}
	
	

}

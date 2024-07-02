import { View, Text, FlatList, RefreshControl } from "react-native";
import { React, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import { StatusBar } from "expo-status-bar";
import EmptyState from "../../components/EmptyState";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { searchPosts } from "../../lib/appwrite";
import { useLocalSearchParams } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, [query]);

  const submit = async () => {
    router.replace("/home");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard key={item.$id + refreshing} video={item} />
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4 justify-center items-center">
              <Text className="font-pmedium text-gray-100 text-sm">
                Search Results For:
              </Text>
              <Text className="text-2xl font-psemibold text-white mt-1">
                {query}
              </Text>

              <View className="mt-6 mb-8">
                <SearchInput initialQuery={query} refetch={refetch} />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
        ListFooterComponent={() => (
          <View className="justify-center items-center px-4">
            <CustomButton
              title="Go Home"
              handlePress={submit}
              containerStyles="w-full"
            />
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} />}
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Search;

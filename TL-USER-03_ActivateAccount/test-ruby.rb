require "selenium-webdriver"

class Test
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element :css => ".uk-alert p" }
    #
    respon = @driver.find_element :css => ".uk-alert p"

    result = Array.new
    result.push respon.text

    expect = @testCase['messages']

    # assertion
      return Set.new(expect) === Set.new(result)
  end
end
